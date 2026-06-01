import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { transcribeAudio, saveAnswer, completeSession } from "../../api/interviewApi";
import { useMediaPipeAnalysis } from "../../hooks/useMediaPipeAnalysis";
import "./InterviewSessionPage.css";

const IS_DEBUG = import.meta.env.VITE_MEDIAPIPE_DEBUG === 'true'

const PHASE = {
  PREP: "prep",
  ANSWERING: "answering",
  WARNING: "warning",
  ENDED: "ended",
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
  const [sttLoading, setSttLoading] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const isMountedRef = useRef(true);
  const phaseRef = useRef(PHASE.PREP);
  const timeLeftRef = useRef(PREP_TIME);
  const isSkippingRef = useRef(false);

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

  const stopRecordingAndTranscribe = useCallback(
    (questionId, questionText, keywords) => {
      return new Promise((resolve) => {
        const mediaRecorder = mediaRecorderRef.current;
        if (!mediaRecorder || mediaRecorder.state === "inactive") {
          resolve(null);
          return;
        }

        const analysisResult = stopAndGetResult();
        const capturedMimeType = mediaRecorder.mimeType || "audio/webm";
        if (isMountedRef.current) setSttLoading(true);

        mediaRecorder.onstop = async () => {
          const finalChunks = [...audioChunksRef.current];
          const audioBlob = new Blob(finalChunks, { type: capturedMimeType });

          try {
            let sttResult = null;
            const isTooShort = audioBlob.size < 1000;

            if (!isTooShort) {
              sttResult = await transcribeAudio(audioBlob);
              console.log("STT 결과:", sttResult);
            } else {
              console.warn("녹음 파일이 너무 짧아서 STT 요청을 보내지 않음");
            }

            const answerStatus = (!sttResult || !sttResult.answerText?.trim())
              ? "QUALITY_FAIL"
              : "ANSWERED";

            const payload = {
              answerStatus,
              questionText: questionText ?? null,
              keywords: keywords ?? [],
              answerText: sttResult?.answerText ?? "",
              answerDuration: sttResult?.answerDuration ?? 0,
              wpm: sttResult?.wpm ?? 0,
              silenceRatio: sttResult?.silenceRatio ?? 0,
              asrConfidence: sttResult?.asrConfidence ?? 0,
              fillerCount: sttResult?.fillerCount ?? 0,
              fillerRatio: sttResult?.fillerRatio ?? 0,
              gazeRatio: analysisResult.gazeRatio,
              gestureDeductions: analysisResult.gestureDeductions,
              scores: {
                gaze: Math.round(analysisResult.gazeRatio * 25),
                gesture: analysisResult.gestureScore,
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
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }

      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.ondataavailable = null;
      }

      closeMediaPipe();
      stopStream();
    };
  }, [initMediaPipe, closeMediaPipe]);

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
            currentQuestionRef.current?.questionText,
            currentQuestionRef.current?.questionKeywords,
        ).then(() => {
          if (isMountedRef.current) {
            setCurrentIdx((prev) => {
              const nextIdx = prev + 1;
              if (nextIdx >= questions.length) {
                stopStream();
                completeSession(session.sessionId).then(() => {
                  navigate(`/interview/result/${session.sessionId}`, {
                    state: { session },
                  });
                }).catch((err) => {
                  console.error("세션 완료 처리 실패:", err);
                  navigate(`/interview/result/${session.sessionId}`, {
                    state: { session },
                  });
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

  const startRecording = () => {
    if (!streamRef.current) return;
    if (mediaRecorderRef.current?.state === "recording") return;
    if (typeof MediaRecorder === "undefined") {
      console.error("MediaRecorder 미지원 브라우저");
      return;
    }

    audioChunksRef.current = [];

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

  const handleStartAnswer = () => {
    clearInterval(timerRef.current);
    setPhase(PHASE.ANSWERING);
    setTimeLeft(ANSWER_TIME);
    startRecording();
  };

  const handleEndAnswer = async () => {
    clearInterval(timerRef.current);
    setPhase(PHASE.ENDED);
    setTimeLeft(0);
    await stopRecordingAndTranscribe(
      currentQuestion.sessionQuestionId,
      currentQuestion.questionText,
      currentQuestion.questionKeywords,
    );
  };

  const handleSkip = async () => {
    if (isSkippingRef.current) return;
    isSkippingRef.current = true;

    clearInterval(timerRef.current);

    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.stop();
      audioChunksRef.current = [];
    }

    const analysisResult = stopAndGetResult();
    const currentQuestion = questions[currentIdx];

    saveAnswer(session.sessionId, currentQuestion.sessionQuestionId, {
      answerStatus: "SKIPPED",
      questionText: currentQuestion?.questionText ?? null,
      keywords: currentQuestion?.questionKeywords ?? [],
      answerText: "",
      answerDuration: 0,
      wpm: 0,
      silenceRatio: 0,
      asrConfidence: 0,
      fillerCount: 0,
      fillerRatio: 0.0,
      gazeRatio: analysisResult.gazeRatio,
      gestureDeductions: analysisResult.gestureDeductions,
      scores: {
        gaze: Math.round(analysisResult.gazeRatio * 25),
        gesture: analysisResult.gestureScore,
        speed: null,
        voice: null,
        content: null,
        total: null,
      },
    }).catch((err) => {
      console.error("SKIPPED 저장 실패:", err);
    }).finally(() => {
      isSkippingRef.current = false;
    });

    resetAnalysis();
    isSkippingRef.current = false;
    goNextQuestion();
  };

  const handleRetry = () => {
    setPhase(PHASE.PREP);
    phaseRef.current = PHASE.PREP;
    setTimeLeft(PREP_TIME);
    timeLeftRef.current = PREP_TIME;
  };

  const goNextQuestion = async () => {
    clearInterval(timerRef.current);

    if (isLastQuestion) {
      closeMediaPipe();
      stopStream();
      try {
        await completeSession(session.sessionId);
      } catch (err) {
        console.error("세션 완료 처리 실패:", err);
      }
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

  const handleDirectAnalysis = async () => {
    closeMediaPipe();
    stopStream();
    try {
      await completeSession(session.sessionId);
    } catch (err) {
      console.error("세션 완료 처리 실패:", err);
    }
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
        <p className="is-question">
          Q{currentQuestion.questionOrder ?? currentIdx + 1}.{" "}
          {currentQuestion.questionText}
        </p>

        <div className="is-video-wrap">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="is-video"
          />

          {IS_DEBUG && (
            <canvas
              ref={debugCanvasRef}
              className="is-debug-canvas"
              width={640}
              height={480}
            />
          )}

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

          {(phase === PHASE.ANSWERING || phase === PHASE.WARNING) && (
            <div className="is-rec-dot" />
          )}
        </div>

        <div className="is-timer-wrap">
          <span className="is-timer" style={{ color: getTimerColor() }}>
            {formatTime(timeLeft)}
          </span>
          <span className="is-timer-label">
            {phase === PHASE.PREP ? "답변 준비 시간" : "남은 답변 시간"}
          </span>
        </div>

        {sttLoading && (
          <div className="is-stt-loading">🎙️ 답변을 분석하고 있습니다...</div>
        )}

        <div className="is-btn-wrap">
          {phase === PHASE.PREP && (
            <>
              <button className="is-btn-skip" onClick={handleSkip} disabled={sttLoading}>
                건너뛰기
              </button>
              <button className="is-btn-main" onClick={handleStartAnswer} disabled={sttLoading}>
                답변 시작
              </button>
            </>
          )}
          {(phase === PHASE.ANSWERING || phase === PHASE.WARNING) && (
            <>
              <button className="is-btn-skip" onClick={handleSkip} disabled={sttLoading}>
                건너뛰기
              </button>
              <button className="is-btn-main" onClick={handleEndAnswer} disabled={sttLoading}>
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