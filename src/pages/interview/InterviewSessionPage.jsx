import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { transcribeAudio, saveAnswer } from "../../api/interviewApi";
import { useMediaPipeAnalysis } from "../../hooks/useMediaPipeAnalysis";
import "./InterviewSessionPage.css";

const IS_DEBUG = import.meta.env.VITE_MEDIAPIPE_DEBUG === 'true'

const PHASE = {
  PREP: "prep", // 답변 준비 (30초)
  ANSWERING: "answering", // 답변 중 (90초)
  WARNING: "warning", // 30초 이하 경고
  ENDED: "ended", // 답변 종료
};

const PREP_TIME = 30;
const ANSWER_TIME = 90;
const WARNING_TIME = 30;

export default function InterviewSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = location.state?.session;

  const questions = session?.questions || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState(PHASE.PREP);
  const [timeLeft, setTimeLeft] = useState(PREP_TIME);
  const [sttLoading, setSttLoading] = useState(false); // STT 처리 중 로딩 상태

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null); // MediaRecorder 인스턴스
  const audioChunksRef = useRef([]); // 녹음 청크 데이터
  const isMountedRef = useRef(true);
  const phaseRef = useRef(PHASE.PREP);
  const timeLeftRef = useRef(PREP_TIME);

  const currentQuestion = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;

  const currentQuestionRef = useRef(currentQuestion);

  const { initMediaPipe, stopAndGetResult, resetAnalysis, closeMediaPipe, debugCanvasRef, detectionStatus } =
    useMediaPipeAnalysis();
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    isMountedRef.current = true;
    if (!session) {
      navigate("/interview", { replace: true });
    }
    return () => {
      isMountedRef.current = false;
    };
  }, [session, navigate]);

  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  // 녹음 종료 -> STT 호출 -> 결과 저장
  // questionId를 인자로 받아 onstop 비동기 시점에도 저장 대상 질문을 고정
  const stopRecordingAndTranscribe = useCallback(
    (questionId) => {
      return new Promise((resolve) => {
        const mediaRecorder = mediaRecorderRef.current;
        if (!mediaRecorder || mediaRecorder.state === "inactive") {
          resolve(null);
          return;
        }

        // 분석 결과 캡처 (stop 전에)
        const analysisResult = stopAndGetResult();

        console.log("MediaPipe 분석 결과:", analysisResult);

        // mimeType만 미리 캡처
        const capturedMimeType = mediaRecorder.mimeType || "audio/webm";
        if (isMountedRef.current) setSttLoading(true);

        mediaRecorder.onstop = async () => {
          // stop 이후 dataavailable까지 반영된 chunks를 사용
          const finalChunks = [...audioChunksRef.current];

          const audioBlob = new Blob(finalChunks, {
            type: capturedMimeType,
          });

          console.log("녹음 Blob 정보:", {
            size: audioBlob.size,
            type: audioBlob.type,
            chunksLength: finalChunks.length,
          });

          try {
            let sttResult = null;

            const isTooShort = audioBlob.size < 1000;

            if (!isTooShort) {
              sttResult = await transcribeAudio(audioBlob);
              console.log("STT 결과:", sttResult);
            } else {
              console.warn("녹음 파일이 너무 짧아서 STT 요청을 보내지 않음");
            }

            console.log("MediaPipe 분석 결과:", analysisResult);

            if (!sttResult) {
              console.warn("sttResult가 없어서 saveAnswer를 호출하지 않음");
              resolve(null);
              return;
            }

            const payload = {
              answerText: sttResult.answerText,
              answerDuration: sttResult.answerDuration,
              wpm: sttResult.wpm,
              silenceRatio: sttResult.silenceRatio,
              asrConfidence: sttResult.asrConfidence,
              fillerCount: sttResult.fillerCount,
              fillerRatio: sttResult.fillerRatio,
              gazeRatio: analysisResult.gazeRatio,
              gestureDeductions: analysisResult.gestureDeductions,
              scores: {
                gaze: Math.round(analysisResult.gazeRatio * 25), // gazeRatio 0~1 → 0~25점
                gesture: analysisResult.gestureScore, // 20점 만점
                speed: null,
                voice: null,
                content: null,
                total: null,
              },
            };

            console.log("답변 저장 payload:", payload);

            await saveAnswer(session.sessionId, questionId, payload);
            resolve(sttResult);
          } catch (err) {
            console.error("STT 처리 실패:", err);
            resolve(null);
          } finally {
            if (isMountedRef.current) setSttLoading(false);
            resetAnalysis();
          }
        };

        mediaRecorder.stop();
      });
    },
    [session?.sessionId, stopAndGetResult, resetAnalysis],
  );

  // 카메라/마이크 스트림 시작
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadeddata = () => {
            initMediaPipe(videoRef.current).catch((error) => {
              console.error("MediaPipe 초기화 실패:", error);
            });
          };
        }
      } catch (error) {
        console.error("카메라 접근 실패:", error);
      }
    };

    startCamera();

    return () => {
      // 페이지 이탈 시 녹음이 살아있으면 먼저 stop 처리
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }

      if (mediaRecorderRef.current) {
        // 언마운트 이후 비동기 콜백이 실행되지 않도록 핸들러 제거
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.ondataavailable = null;
      }

      closeMediaPipe();
      stopStream();
    };
  }, [initMediaPipe, closeMediaPipe]);

  // 타이머
  useEffect(() => {
    clearInterval(timerRef.current);
    if (phase === PHASE.ENDED) return;

    timerRef.current = setInterval(() => {
      const nextTime = Math.max(timeLeftRef.current - 1, 0);
      timeLeftRef.current = nextTime;
      setTimeLeft(nextTime);

      if (phaseRef.current === PHASE.ANSWERING && nextTime <= WARNING_TIME) {
        setPhase(PHASE.WARNING);
        phaseRef.current = PHASE.WARNING;
      }

      if (nextTime !== 0) return;
      clearInterval(timerRef.current);

      if (phaseRef.current === PHASE.PREP) {
        setPhase(PHASE.ANSWERING);
        phaseRef.current = PHASE.ANSWERING;
        setTimeLeft(ANSWER_TIME);
        timeLeftRef.current = ANSWER_TIME;
        startRecording();
        return;
      }

      if (
        phaseRef.current === PHASE.ANSWERING ||
        phaseRef.current === PHASE.WARNING
      ) {
        setPhase(PHASE.ENDED);
        phaseRef.current = PHASE.ENDED;
        stopRecordingAndTranscribe(
          currentQuestionRef.current?.sessionQuestionId,
        ).then(() => {
          if (isMountedRef.current) {
            // 마지막 질문이면 결과 페이지로, 아니면 다음 질문으로
            setCurrentIdx((prev) => {
              const nextIdx = prev + 1;
              if (nextIdx >= questions.length) {
                stopStream();
                navigate(`/interview/result/${session.sessionId}`, {
                  state: { session },
                });
              } else {
                setPhase(PHASE.PREP);
                phaseRef.current = PHASE.PREP;
                setTimeLeft(PREP_TIME);
                timeLeftRef.current = PREP_TIME;
              }
              return nextIdx >= questions.length ? prev : nextIdx;
            });
          }
        });
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [phase, currentQuestion?.sessionQuestionId, stopRecordingAndTranscribe]);

  function stopStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  // 녹음 시작
  const startRecording = () => {
    if (!streamRef.current) return;
    if (mediaRecorderRef.current?.state === "recording") return;
    if (typeof MediaRecorder === "undefined") {
      console.error("MediaRecorder 미지원 브라우저");
      return;
    }

    audioChunksRef.current = [];

    // 오디오 트랙만 분리해서 새 스트림 생성
    const audioTracks = streamRef.current.getAudioTracks();
    const audioStream = new MediaStream(audioTracks);

    const mimeType = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
      "",
    ].find((type) => type === "" || MediaRecorder.isTypeSupported(type));

    try {
      const mediaRecorder = new MediaRecorder(
        audioStream,
        mimeType ? { mimeType } : {},
      );

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      console.log("녹음 시작! mimeType:", mediaRecorder.mimeType);
    } catch (err) {
      console.error("MediaRecorder 생성 실패:", err);
    }
  };

  // 답변 시작
  const handleStartAnswer = () => {
    clearInterval(timerRef.current);
    setPhase(PHASE.ANSWERING);
    setTimeLeft(ANSWER_TIME);
    startRecording(); // 녹음 시작
  };

  // 답변 종료
  const handleEndAnswer = async () => {
    clearInterval(timerRef.current);
    setPhase(PHASE.ENDED);
    setTimeLeft(0);
    await stopRecordingAndTranscribe(currentQuestion.sessionQuestionId); // 녹음 종료 + STT
  };

  // 건너뛰기 (녹음 중이면 종료)
  const handleSkip = async () => {
    clearInterval(timerRef.current);

    // 건너뛰기는 저장하지 않고 녹음만 중단
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.stop();
      audioChunksRef.current = [];
    }

    goNextQuestion();
  };

  // 다시 답변
  const handleRetry = () => {
    setPhase(PHASE.PREP);
    setTimeLeft(PREP_TIME);
  };

  // 다음 질문
  const goNextQuestion = () => {
    if (isLastQuestion) {
      closeMediaPipe();
      stopStream();
      navigate(`/interview/result/${session.sessionId}`, {
        state: { session },
      });
      return;
    }

    setCurrentIdx((prev) => prev + 1);
    setPhase(PHASE.PREP);
    phaseRef.current = PHASE.PREP;
    setTimeLeft(PREP_TIME);
    timeLeftRef.current = PREP_TIME;
    resetAnalysis();
  };

  // 바로 분석
  const handleDirectAnalysis = () => {
    closeMediaPipe();
    stopStream();
    navigate(`/interview/result/${session.sessionId}`, { state: { session } });
  };

  const getTimerColor = () => {
    if (phase === PHASE.PREP) return "#bbb";
    if (phase === PHASE.WARNING || phase === PHASE.ENDED) return "#e53935";
    return "#f9a825";
  };

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!session || !currentQuestion) return null;

  return (
    <div className="is-page">
      {/* 헤더 */}
      <header className="is-header">
        <button
          className="is-back"
          onClick={() => {
            closeMediaPipe();
            stopStream();
            navigate(-1);
          }}
        >
          ‹
        </button>
        <span className="is-header-title">AlgoTalk</span>
      </header>

      <div className="is-container">
        {/* 질문 */}
        <p className="is-question">
          Q{currentQuestion.questionOrder ?? currentIdx + 1}.{" "}
          {currentQuestion.questionText}
        </p>

        {/* 카메라 영역 */}
        <div className="is-video-wrap">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="is-video"
          />

          {/* 디버그 모드: 랜드마크 오버레이 canvas */}
          {IS_DEBUG && (
            <canvas
              ref={debugCanvasRef}
              className="is-debug-canvas"
              width={640}
              height={480}
            />
          )}

          {/* 실전 모드: 분석 상태 UI (우상단 작게 표시) */}
          {(phase === PHASE.ANSWERING || phase === PHASE.WARNING) && (
            <div className="is-detection-status">
              <span className={detectionStatus.face ? 'is-status-on' : 'is-status-off'}>
                ● 시선 분석
              </span>
              <span className={detectionStatus.pose ? 'is-status-on' : 'is-status-off'}>
                ● 자세 분석
              </span>
              <span className="is-status-on">● 음성 녹음</span>
            </div>
          )}

          {/* 녹음 중 표시 */}
          {(phase === PHASE.ANSWERING || phase === PHASE.WARNING) && (
            <div className="is-rec-dot" />
          )}
        </div>

        {/* 타이머 */}
        <div className="is-timer-wrap">
          <span className="is-timer" style={{ color: getTimerColor() }}>
            {formatTime(timeLeft)}
          </span>
          <span className="is-timer-label">
            {phase === PHASE.PREP ? "답변 준비 시간" : "남은 답변 시간"}
          </span>
        </div>

        {/* STT 처리 중 로딩 */}
        {sttLoading && (
          <div className="is-stt-loading">🎙️ 답변을 분석하고 있습니다...</div>
        )}

        {/* 버튼 영역 */}
        <div className="is-btn-wrap">
          {phase === PHASE.PREP && (
            <>
              <button className="is-btn-skip" onClick={handleSkip}>
                건너뛰기
              </button>
              <button className="is-btn-main" onClick={handleStartAnswer}>
                답변 시작
              </button>
            </>
          )}
          {(phase === PHASE.ANSWERING || phase === PHASE.WARNING) && (
            <>
              <button className="is-btn-skip" onClick={handleSkip}>
                건너뛰기
              </button>
              <button className="is-btn-main" onClick={handleEndAnswer}>
                답변 종료
              </button>
            </>
          )}
          {phase === PHASE.ENDED && (
            <>
              <button
                className="is-btn-skip"
                onClick={handleRetry}
                disabled={sttLoading}
              >
                다시 답변
              </button>
              <button
                className="is-btn-main"
                onClick={goNextQuestion}
                disabled={sttLoading}
              >
                {isLastQuestion ? "결과 보기" : "다음 질문"}
              </button>
            </>
          )}
        </div>

        {/* 기타 옵션 */}
        {phase === PHASE.ENDED && (
          <div className="is-extra-opts">
            <div className="is-divider">
              <span>기타 옵션</span>
            </div>
            <button
              className="is-direct-analysis"
              onClick={handleDirectAnalysis}
              disabled={sttLoading}
            >
              바로 분석(남은 질문 전부 스킵)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
