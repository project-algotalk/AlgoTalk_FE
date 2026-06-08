import { useRef, useCallback, useState } from "react";
import {
  FilesetResolver,
  FaceLandmarker,
  PoseLandmarker,
} from "@mediapipe/tasks-vision";

// 시선 판단 임계값
const GAZE_THRESHOLD_X = 0.1;

// 눈 깜빡임 임계값
const EAR_THRESHOLD = 0.2; // EAR이 이 값 이하면 눈 감은 것으로 판단
const BLINK_RATE_THRESHOLD = 30; // 분당 30회 초과 시 과도한 깜빡임

// 제스처 감점 기준
const DEDUCTION = {
  FACE_TOUCH: 2, // 얼굴 만지기
  ARMS_CROSSED: 3, // 팔짱
  HAND_WAVING: 2, // 과도한 손 흔듦
  POSTURE_BAD: 1, // 자세 무너짐 (10초당)
  HAND_VISIBLE: 1, // 손이 화면에 보임
  EXCESSIVE_BLINK: 2, // 과도한 깜빡임
};

// MediaPipe Tasks Vision WASM 경로
const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";

// Face Landmarker 모델
const FACE_LANDMARKER_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task";

// Pose Landmarker 모델
// lite 모델을 사용하면 브라우저 실시간 분석에서 상대적으로 부담이 적음
const POSE_LANDMARKER_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task";

export function useMediaPipeAnalysis() {
  // MediaPipe 인스턴스 ref
  const faceLandmarkerRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const isRunningRef = useRef(false);
  const lastVideoTimeRef = useRef(-1);

  // 눈 깜빡임 방지 ref
  const blinkCountRef = useRef(0); // 깜빡임 횟수
  const blinkStartTimeRef = useRef(null); // 분석 시작 시간
  const isEyeClosedRef = useRef(false); // 현재 눈 감김 상태

  // 분석 데이터 누적 ref
  const gazeFramesRef = useRef({ total: 0, looking: 0 }); // 시선 프레임 누적
  const gestureDeductionsRef = useRef([]); // 제스처 감점 목록
  const prevWristPosRef = useRef(null); // 손 흔듦 감지용 이전 손목 위치
  const badPostureStartRef = useRef(null); // 자세 무너짐 시작 시간
  const poseFramesRef = useRef({ total: 0, detected: 0 }); // 자세 감지 프레임 추적(화면에 아무도 없는 경우)

  // 디버그 오버레이 ref
  const debugCanvasRef = useRef(null); // 디버그용 canvas 요소
  const lastStatusUpdateRef = useRef(0); // 상태 UI throttle용 마지막 업데이트 시간

  // 상태 UI (500ms throttle로 업데이트)
  const [detectionStatus, setDetectionStatus] = useState({
    face: false,
    pose: false,
  });

  // 감점 누적 (type별 중복 방지, count만 증가)
  const addDeduction = useCallback((type, point) => {
    const existing = gestureDeductionsRef.current.find((d) => d.type === type);

    if (existing) {
      existing.count += 1;
      return;
    }

    gestureDeductionsRef.current.push({
      type,
      count: 1,
      deduction: point,
    });
  }, []);

  // EAR(Eye Aspect Ratio) 계산
  // 눈 위아래 거리 / 눈 좌우 거리 비율
  // 값이 낮을수록 눈이 감긴 상태
  const calcEAR = (landmarks, topIdx, bottomIdx, leftIdx, rightIdx) => {
    const top = landmarks[topIdx];
    const bottom = landmarks[bottomIdx];
    const left = landmarks[leftIdx];
    const right = landmarks[rightIdx];

    if (!top || !bottom || !left || !right) return 1.0;

    const vertical = Math.hypot(top.x - bottom.x, top.y - bottom.y);
    const horizontal = Math.hypot(left.x - right.x, left.y - right.y);

    if (horizontal === 0) return 1.0;
    return vertical / horizontal;
  };

  // 시선 분석 + 눈 깜빡임 감지
  // Face Landmarker 결과 랜드마크 배열을 받아 처리
  const analyzeGaze = useCallback(
    (landmarks) => {
      if (!landmarks || landmarks.length === 0) return;

      // Face Landmarker는 얼굴 랜드마크를 반환합니다.
      // iris 중심을 사용하기 위해 468, 473 인덱스를 사용합니다.
      const leftIris = landmarks[468];
      const rightIris = landmarks[473];

      const leftEyeLeft = landmarks[33];
      const leftEyeRight = landmarks[133];

      const rightEyeLeft = landmarks[362];
      const rightEyeRight = landmarks[263];

      if (
        leftIris &&
        rightIris &&
        leftEyeLeft &&
        leftEyeRight &&
        rightEyeLeft &&
        rightEyeRight
      ) {
        const leftEyeWidth = Math.abs(leftEyeRight.x - leftEyeLeft.x);
        const rightEyeWidth = Math.abs(rightEyeRight.x - rightEyeLeft.x);

        if (leftEyeWidth > 0 && rightEyeWidth > 0) {
          const leftIrisRelX =
            (leftIris.x - leftEyeLeft.x) / leftEyeWidth - 0.5;
          const rightIrisRelX =
            (rightIris.x - rightEyeLeft.x) / rightEyeWidth - 0.5;
          const avgRelX = (leftIrisRelX + rightIrisRelX) / 2;

          gazeFramesRef.current.total += 1;
          if (Math.abs(avgRelX) <= GAZE_THRESHOLD_X) {
            gazeFramesRef.current.looking += 1;
          }
        }
      }

      // ← 눈 깜빡임 분석 추가
      // 왼쪽 눈 EAR: 위(159), 아래(145), 좌(33), 우(133)
      // 오른쪽 눈 EAR: 위(386), 아래(374), 좌(362), 우(263)
      const leftEAR = calcEAR(landmarks, 159, 145, 33, 133);
      const rightEAR = calcEAR(landmarks, 386, 374, 362, 263);
      const avgEAR = (leftEAR + rightEAR) / 2;

      if (!blinkStartTimeRef.current) {
        blinkStartTimeRef.current = Date.now();
      }

      if (avgEAR < EAR_THRESHOLD) {
        // 눈 감김 감지
        isEyeClosedRef.current = true;
      } else {
        if (isEyeClosedRef.current) {
          // 눈 떠짐 -> 깜빡임 1회 완료
          blinkCountRef.current += 1;
          isEyeClosedRef.current = false;
        }
      }

      // 1분 경과 시 분당 깜빡임 횟수 체크
      const elapsed = (Date.now() - blinkStartTimeRef.current) / 1000 / 60; // 분 단위
      if (elapsed >= 1) {
        const blinkRate = blinkCountRef.current / elapsed;
        if (blinkRate > BLINK_RATE_THRESHOLD) {
          addDeduction("EXCESSIVE_BLINK", DEDUCTION.EXCESSIVE_BLINK);
        }
        // 1분마다 리셋
        blinkCountRef.current = 0;
        blinkStartTimeRef.current = Date.now();
      }
    },
    [addDeduction],
  );

  // 제스처 분석 (Pose Landmarker 결과 처리)
  const analyzeGesture = useCallback(
    (landmarks) => {
      if (!landmarks || landmarks.length === 0) return;

      // Pose Landmarker landmark index
      const nose = landmarks[0];

      const leftWrist = landmarks[15];
      const rightWrist = landmarks[16];

      const rightElbow = landmarks[14];

      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];

      const now = Date.now();

      // 1. 손이 화면에 보임 (손목 visibility 기준)
      if (leftWrist?.visibility > 0.5 || rightWrist?.visibility > 0.5) {
        addDeduction("HAND_VISIBLE", DEDUCTION.HAND_VISIBLE);
      }

      // 2. 얼굴 만지기 (손목-코 거리 기준)
      if (leftWrist?.visibility > 0.5 && nose) {
        const dist = Math.hypot(leftWrist.x - nose.x, leftWrist.y - nose.y);
        if (dist < 0.15) addDeduction("FACE_TOUCH", DEDUCTION.FACE_TOUCH);
      }
      if (rightWrist?.visibility > 0.5 && nose) {
        const dist = Math.hypot(rightWrist.x - nose.x, rightWrist.y - nose.y);
        if (dist < 0.15) addDeduction("FACE_TOUCH", DEDUCTION.FACE_TOUCH);
      }

      // 3. 팔짱 (왼쪽 손목이 오른쪽 팔꿈치 근처)
      if (leftWrist?.visibility > 0.5 && rightElbow?.visibility > 0.5) {
        const dist = Math.hypot(
          leftWrist.x - rightElbow.x,
          leftWrist.y - rightElbow.y,
        );
        if (dist < 0.1) addDeduction("ARMS_CROSSED", DEDUCTION.ARMS_CROSSED);
      }

      // 4. 과도한 손 흔듦 (이전 프레임 대비 손목 이동량)
      if (leftWrist?.visibility > 0.5 && prevWristPosRef.current) {
        const movement = Math.hypot(
          leftWrist.x - prevWristPosRef.current.x,
          leftWrist.y - prevWristPosRef.current.y,
        );
        if (movement > 0.05) addDeduction("HAND_WAVING", DEDUCTION.HAND_WAVING);
      }
      prevWristPosRef.current = leftWrist?.visibility > 0.5 ? leftWrist : null;

      // 5. 자세 무너짐 (어깨 기울기 기준, 10초 지속 시 감점)
      if (leftShoulder && rightShoulder) {
        const shoulderTilt = Math.abs(leftShoulder.y - rightShoulder.y);

        if (shoulderTilt > 0.05) {
          if (!badPostureStartRef.current) {
            badPostureStartRef.current = now;
          } else if (now - badPostureStartRef.current >= 10000) {
            addDeduction("POSTURE_BAD", DEDUCTION.POSTURE_BAD);
            badPostureStartRef.current = now;
          }
        } else {
          badPostureStartRef.current = null;
        }
      }
    },
    [addDeduction],
  );

  // 디버그 오버레이 canvas 드로잉
  // 분석에 사용하는 랜드마크 점만 시각화
  // React state를 거치지 않고 직접 canvas에 그림 (성능 최적화)
  const drawDebugOverlay = useCallback(
    (canvas, faceLandmarks, poseLandmarks) => {
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Face 랜드마크 그리기 (분석에 사용하는 점만)
      if (faceLandmarks) {
        const facePoints = [
          468,
          473, // iris 중심 (파란색)
          33,
          133, // 왼쪽 눈 끝점 (초록색)
          362,
          263, // 오른쪽 눈 끝점 (초록색)
          159,
          145, // 왼쪽 눈 위아래 (초록색)
          386,
          374, // 오른쪽 눈 위아래 (초록색)
        ];

        facePoints.forEach((idx) => {
          const point = faceLandmarks[idx];
          if (!point) return;

          const x = point.x * canvas.width;
          const y = point.y * canvas.height;

          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);

          // iris는 파란색, 눈은 초록색
          ctx.fillStyle = [468, 473].includes(idx) ? "#00bfff" : "#00ff88";
          ctx.fill();
        });
      }

      // Pose 랜드마크: 분석에 사용하는 점 + 연결선 표시
      if (poseLandmarks) {
        const posePoints = [
          0, // 코
          11,
          12, // 어깨
          13,
          14, // 팔꿈치
          15,
          16, // 손목
        ];

        // 점 그리기
        posePoints.forEach((idx) => {
          const point = poseLandmarks[idx];
          if (!point || point.visibility < 0.5) return;

          const x = point.x * canvas.width;
          const y = point.y * canvas.height;

          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "#ff6b35";
          ctx.fill();
        });

        // 연결선 그리기 (어깨-팔꿈치-손목)
        const connections = [
          [11, 13],
          [13, 15], // 왼팔
          [12, 14],
          [14, 16], // 오른팔
          [11, 12], // 어깨
        ];

        ctx.strokeStyle = "rgba(255, 107, 53, 0.6)";
        ctx.lineWidth = 2;

        connections.forEach(([startIdx, endIdx]) => {
          const start = poseLandmarks[startIdx];
          const end = poseLandmarks[endIdx];

          if (!start || !end) return;
          if (start.visibility < 0.5 || end.visibility < 0.5) return;

          ctx.beginPath();
          ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
          ctx.lineTo(end.x * canvas.width, end.y * canvas.height);
          ctx.stroke();
        });
      }
    },
    [],
  );

  // MediaPipe 초기화 및 실시간 분석 루프 시작
  const initMediaPipe = useCallback(
    async (videoElement) => {
      if (!videoElement) {
        console.warn("videoElement가 없습니다.");
        return;
      }

      // 이미 초기화된 경우 중복 실행 방지
      if (faceLandmarkerRef.current && poseLandmarkerRef.current) {
        return;
      }

      const vision = await FilesetResolver.forVisionTasks(WASM_URL);

      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: FACE_LANDMARKER_MODEL_URL,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
        minFaceDetectionConfidence: 0.5,
        minFacePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: false,
      });

      const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: POSE_LANDMARKER_MODEL_URL,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
        outputSegmentationMasks: false,
      });

      faceLandmarkerRef.current = faceLandmarker;
      poseLandmarkerRef.current = poseLandmarker;

      isRunningRef.current = true;

      const analyze = () => {
          if (!isRunningRef.current) return;

          const face = faceLandmarkerRef.current;
          const pose = poseLandmarkerRef.current;

          if (!face || !pose) return;  // ← 먼저 체크

          if (videoElement.readyState >= 2) {
              const currentTime = videoElement.currentTime;

              if (currentTime !== lastVideoTimeRef.current) {
                  const timestampMs = performance.now();

                  try {
                      const faceResult = face.detectForVideo(videoElement, timestampMs);
                      const poseResult = pose.detectForVideo(videoElement, timestampMs);

                      const faceLandmarks = faceResult.faceLandmarks?.[0];
                      const poseLandmarks = poseResult.landmarks?.[0];

                      // 포즈 프레임 누적 ← 여기에만 있어야 함
                      poseFramesRef.current.total += 1;
                      if (poseLandmarks) {
                          poseFramesRef.current.detected += 1;
                      }

                      if (faceLandmarks) analyzeGaze(faceLandmarks);
                      if (poseLandmarks) analyzeGesture(poseLandmarks);

                      if (debugCanvasRef.current) {
                          drawDebugOverlay(
                              debugCanvasRef.current,
                              faceLandmarks,
                              poseLandmarks,
                          );
                      }

                      const now = Date.now();
                      if (now - lastStatusUpdateRef.current > 500) {
                          setDetectionStatus({
                              face: !!faceLandmarks,
                              pose: !!poseLandmarks,
                          });
                          lastStatusUpdateRef.current = now;
                      }

                      lastVideoTimeRef.current = currentTime;
                  } catch (error) {
                      console.error("MediaPipe Tasks 분석 중 오류:", error);
                  }
              }
          }

          animationRef.current = requestAnimationFrame(analyze);
      };

      animationRef.current = requestAnimationFrame(analyze);
    },
    [analyzeGaze, analyzeGesture],
  );

  // 분석 중지 및 결과 반환
  const stopAndGetResult = useCallback(() => {
      const { total, looking } = gazeFramesRef.current;
      const gazeRatio = total > 0
          ? Math.round((looking / total) * 100) / 100
          : 0;

      const totalDeduction = gestureDeductionsRef.current.reduce(
          (sum, d) => sum + d.deduction, 0
      );

      // 포즈 감지율 계산
      const { total: poseTotal, detected: poseDetected } = poseFramesRef.current;
      const poseDetectionRate = poseTotal > 0 ? poseDetected / poseTotal : 0;

      // 포즈 감지율 기반 추가 감점
      let poseDeduction = 0;
      if (poseDetectionRate < 0.5) {
          poseDeduction = 20;        // 0점
      } else if (poseDetectionRate < 0.7) {
          poseDeduction = 13;        // ~7점
      } else if (poseDetectionRate < 0.9) {
          poseDeduction = 3;         // ~17점
      }

      const gestureScore = Math.max(0, 20 - totalDeduction - poseDeduction);

      return {
          gazeRatio,
          gestureDeductions: [...gestureDeductionsRef.current],
          gestureScore,
          poseDetectionRate,  // 디버깅/결과 표시용
      };
  }, []);

  // 다음 질문 시작 시 분석 데이터 초기화
  const resetAnalysis = useCallback(() => {
    gazeFramesRef.current = { total: 0, looking: 0 };
    gestureDeductionsRef.current = [];
    poseFramesRef.current = { total: 0, detected: 0 };
    prevWristPosRef.current = null;
    badPostureStartRef.current = null;
    // lastVideoTimeRef.current = -1;
    blinkCountRef.current = 0;
    blinkStartTimeRef.current = null;
    isEyeClosedRef.current = false;
  }, []);

  // 페이지 이탈 시 MediaPipe 리소스 정리
  const closeMediaPipe = useCallback(() => {
    isRunningRef.current = false;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    faceLandmarkerRef.current?.close();
    poseLandmarkerRef.current?.close();

    faceLandmarkerRef.current = null;
    poseLandmarkerRef.current = null;
  }, []);

  return {
    initMediaPipe,
    stopAndGetResult,
    resetAnalysis,
    closeMediaPipe,
    debugCanvasRef,
    detectionStatus,
  };
}
