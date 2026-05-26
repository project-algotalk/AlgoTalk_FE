import { useRef, useCallback } from 'react'
import {
  FilesetResolver,
  FaceLandmarker,
  PoseLandmarker,
} from '@mediapipe/tasks-vision'

// 시선 판단 임계값
const GAZE_THRESHOLD_X = 0.1

// 제스처 감점 기준
const DEDUCTION = {
  FACE_TOUCH: 2,      // 얼굴 만지기
  ARMS_CROSSED: 3,    // 팔짱
  HAND_WAVING: 2,     // 과도한 손 흔듦
  POSTURE_BAD: 1,     // 자세 무너짐 (10초당)
  HAND_VISIBLE: 1,    // 손이 화면에 보임
}

// MediaPipe Tasks Vision WASM 경로
const WASM_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'

// Face Landmarker 모델
const FACE_LANDMARKER_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task'

// Pose Landmarker 모델
// lite 모델을 사용하면 브라우저 실시간 분석에서 상대적으로 부담이 적습니다.
const POSE_LANDMARKER_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task'

export function useMediaPipeAnalysis() {
  const faceLandmarkerRef = useRef(null)
  const poseLandmarkerRef = useRef(null)
  const animationRef = useRef(null)
  const isRunningRef = useRef(false)
  const lastVideoTimeRef = useRef(-1)

  // 분석 데이터 누적
  const gazeFramesRef = useRef({ total: 0, looking: 0 })
  const gestureDeductionsRef = useRef([])
  const prevWristPosRef = useRef(null)
  const badPostureStartRef = useRef(null)

  // 감점 누적
  const addDeduction = useCallback((type, point) => {
    const existing = gestureDeductionsRef.current.find((d) => d.type === type)

    if (existing) {
      existing.count += 1
      return
    }

    gestureDeductionsRef.current.push({
      type,
      count: 1,
      deduction: point,
    })
  }, [])

  // 시선 분석
  const analyzeGaze = useCallback((landmarks) => {
    if (!landmarks || landmarks.length === 0) return

    // Face Landmarker는 얼굴 랜드마크를 반환합니다.
    // iris 중심을 사용하기 위해 468, 473 인덱스를 사용합니다.
    const leftIris = landmarks[468]
    const rightIris = landmarks[473]

    const leftEyeLeft = landmarks[33]
    const leftEyeRight = landmarks[133]

    const rightEyeLeft = landmarks[362]
    const rightEyeRight = landmarks[263]

    if (
      !leftIris ||
      !rightIris ||
      !leftEyeLeft ||
      !leftEyeRight ||
      !rightEyeLeft ||
      !rightEyeRight
    ) {
      return
    }

    const leftEyeWidth = Math.abs(leftEyeRight.x - leftEyeLeft.x)
    const rightEyeWidth = Math.abs(rightEyeRight.x - rightEyeLeft.x)

    if (leftEyeWidth === 0 || rightEyeWidth === 0) return

    const leftIrisRelX = (leftIris.x - leftEyeLeft.x) / leftEyeWidth - 0.5
    const rightIrisRelX = (rightIris.x - rightEyeLeft.x) / rightEyeWidth - 0.5

    const avgRelX = (leftIrisRelX + rightIrisRelX) / 2

    gazeFramesRef.current.total += 1

    if (Math.abs(avgRelX) <= GAZE_THRESHOLD_X) {
      gazeFramesRef.current.looking += 1
    }
  }, [])

  // 제스처 분석
  const analyzeGesture = useCallback((landmarks) => {
    if (!landmarks || landmarks.length === 0) return

    // Pose Landmarker landmark index
    const nose = landmarks[0]

    const leftWrist = landmarks[15]
    const rightWrist = landmarks[16]

    const rightElbow = landmarks[14]

    const leftShoulder = landmarks[11]
    const rightShoulder = landmarks[12]

    const leftHip = landmarks[23]
    const rightHip = landmarks[24]

    const now = Date.now()

    // 1. 손이 화면에 보임
    if (leftWrist?.visibility > 0.5 || rightWrist?.visibility > 0.5) {
      addDeduction('HAND_VISIBLE', DEDUCTION.HAND_VISIBLE)
    }

    // 2. 얼굴 만지기
    if (leftWrist?.visibility > 0.5 && nose) {
      const dist = Math.hypot(leftWrist.x - nose.x, leftWrist.y - nose.y)

      if (dist < 0.15) {
        addDeduction('FACE_TOUCH', DEDUCTION.FACE_TOUCH)
      }
    }

    if (rightWrist?.visibility > 0.5 && nose) {
      const dist = Math.hypot(rightWrist.x - nose.x, rightWrist.y - nose.y)

      if (dist < 0.15) {
        addDeduction('FACE_TOUCH', DEDUCTION.FACE_TOUCH)
      }
    }

    // 3. 팔짱
    if (leftWrist?.visibility > 0.5 && rightElbow?.visibility > 0.5) {
      const dist = Math.hypot(
        leftWrist.x - rightElbow.x,
        leftWrist.y - rightElbow.y,
      )

      if (dist < 0.1) {
        addDeduction('ARMS_CROSSED', DEDUCTION.ARMS_CROSSED)
      }
    }

    // 4. 과도한 손 흔듦
    if (leftWrist?.visibility > 0.5 && prevWristPosRef.current) {
      const movement = Math.hypot(
        leftWrist.x - prevWristPosRef.current.x,
        leftWrist.y - prevWristPosRef.current.y,
      )

      if (movement > 0.05) {
        addDeduction('HAND_WAVING', DEDUCTION.HAND_WAVING)
      }
    }

    prevWristPosRef.current = leftWrist?.visibility > 0.5 ? leftWrist : null

    // 5. 자세 무너짐
    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2
      const hipMidY = (leftHip.y + rightHip.y) / 2
      const shoulderTilt = Math.abs(leftShoulder.y - rightShoulder.y)

      if (shoulderTilt > 0.05 || shoulderMidY > hipMidY * 0.85) {
        if (!badPostureStartRef.current) {
          badPostureStartRef.current = now
        } else if (now - badPostureStartRef.current >= 10000) {
          addDeduction('POSTURE_BAD', DEDUCTION.POSTURE_BAD)
          badPostureStartRef.current = now
        }
      } else {
        badPostureStartRef.current = null
      }
    }
  }, [addDeduction])

  // MediaPipe Tasks 초기화
  const initMediaPipe = useCallback(async (videoElement) => {
    if (!videoElement) {
      console.warn('videoElement가 없습니다.')
      return
    }

    if (faceLandmarkerRef.current && poseLandmarkerRef.current) {
      return
    }

    const vision = await FilesetResolver.forVisionTasks(WASM_URL)

    const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: FACE_LANDMARKER_MODEL_URL,
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numFaces: 1,
      minFaceDetectionConfidence: 0.5,
      minFacePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
    })

    const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: POSE_LANDMARKER_MODEL_URL,
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
      outputSegmentationMasks: false,
    })

    faceLandmarkerRef.current = faceLandmarker
    poseLandmarkerRef.current = poseLandmarker

    isRunningRef.current = true

    const analyze = () => {
      if (!isRunningRef.current) return

      const face = faceLandmarkerRef.current
      const pose = poseLandmarkerRef.current

      if (!face || !pose) return

      if (videoElement.readyState >= 2) {
        const currentTime = videoElement.currentTime

        // 같은 프레임을 중복 분석하지 않기 위한 방어 코드
        if (currentTime !== lastVideoTimeRef.current) {
          const timestampMs = performance.now()

          try {
            const faceResult = face.detectForVideo(videoElement, timestampMs)
            const poseResult = pose.detectForVideo(videoElement, timestampMs)

            const faceLandmarks = faceResult.faceLandmarks?.[0]
            const poseLandmarks = poseResult.landmarks?.[0]

            if (faceLandmarks) {
              analyzeGaze(faceLandmarks)
            }

            if (poseLandmarks) {
              analyzeGesture(poseLandmarks)
            }

            lastVideoTimeRef.current = currentTime
          } catch (error) {
            console.error('MediaPipe Tasks 분석 중 오류:', error)
          }
        }
      }

      animationRef.current = requestAnimationFrame(analyze)
    }

    animationRef.current = requestAnimationFrame(analyze)
  }, [analyzeGaze, analyzeGesture])

  // 분석 중지 및 결과 반환
  const stopAndGetResult = useCallback(() => {
    isRunningRef.current = false

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    const { total, looking } = gazeFramesRef.current
    const gazeRatio = total > 0 ? Math.round((looking / total) * 100) / 100 : 0

    const totalDeduction = gestureDeductionsRef.current.reduce(
      (sum, d) => sum + d.deduction,
      0,
    )

    const gestureScore = Math.max(0, 20 - totalDeduction)

    return {
      gazeRatio,
      gestureDeductions: gestureDeductionsRef.current,
      gestureScore,
    }
  }, [])

  // 분석 데이터 초기화
  const resetAnalysis = useCallback(() => {
    gazeFramesRef.current = { total: 0, looking: 0 }
    gestureDeductionsRef.current = []
    prevWristPosRef.current = null
    badPostureStartRef.current = null
    lastVideoTimeRef.current = -1
  }, [])

  // MediaPipe 리소스 정리
  const closeMediaPipe = useCallback(() => {
    isRunningRef.current = false

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    faceLandmarkerRef.current?.close()
    poseLandmarkerRef.current?.close()

    faceLandmarkerRef.current = null
    poseLandmarkerRef.current = null
  }, [])

  return {
    initMediaPipe,
    stopAndGetResult,
    resetAnalysis,
    closeMediaPipe,
  }
}