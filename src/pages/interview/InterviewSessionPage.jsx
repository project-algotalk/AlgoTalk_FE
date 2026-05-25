import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { transcribeAudio, saveAnswer } from '../../api/interviewApi'
import './InterviewSessionPage.css'

const PHASE = {
  PREP: 'prep',         // 답변 준비 (30초)
  ANSWERING: 'answering', // 답변 중 (90초)
  WARNING: 'warning',   // 30초 이하 경고
  ENDED: 'ended',       // 답변 종료
}

const PREP_TIME = 30
const ANSWER_TIME = 90
const WARNING_TIME = 30

export default function InterviewSessionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const session = location.state?.session

  const questions = session?.questions || []
  const [currentIdx, setCurrentIdx] = useState(0)
  const [phase, setPhase] = useState(PHASE.PREP)
  const [timeLeft, setTimeLeft] = useState(PREP_TIME)
  const [sttLoading, setSttLoading] = useState(false)  // STT 처리 중 로딩 상태

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const mediaRecorderRef = useRef(null)   // MediaRecorder 인스턴스
  const audioChunksRef = useRef([])       // 녹음 청크 데이터

  const currentQuestion = questions[currentIdx]
  const isLastQuestion = currentIdx === questions.length - 1

  useEffect(() => {
    if (!session) {
      navigate('/interview', { replace: true })
    }
  }, [session, navigate])

  // 카메라/마이크 스트림 시작
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch {
        console.error('카메라 접근 실패')
      }
    }
    startCamera()
    return () => {
      // 페이지 이탈 시 녹음이 살아있으면 먼저 stop 처리
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      if (mediaRecorderRef.current) {
        // 언마운트 이후 비동기 콜백이 실행되지 않도록 핸들러 제거
        mediaRecorderRef.current.onstop = null
        mediaRecorderRef.current.ondataavailable = null
      }
      stopStream()
    }
  }, [])

  // 타이머
  useEffect(() => {
    clearInterval(timerRef.current)
    if (phase === PHASE.ENDED) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          if (phase === PHASE.PREP) {
            setPhase(PHASE.ANSWERING)
            setTimeLeft(ANSWER_TIME)
            startRecording()  // 답변 시작 시 녹음 시작
          } else {
            setPhase(PHASE.ENDED)
            setTimeLeft(0)
            stopRecordingAndTranscribe(currentQuestion.sessionQuestionId)  // 답변 종료 시 녹음 종료 + STT
          }
          return 0
        }
        if (phase === PHASE.ANSWERING && prev - 1 <= WARNING_TIME) {
          setPhase(PHASE.WARNING)
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [phase, currentQuestion?.sessionQuestionId, stopRecordingAndTranscribe])

  function stopStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  // 녹음 시작
  const startRecording = () => {
    if (!streamRef.current) {
      console.error('스트림 없음')
      return
    }

    audioChunksRef.current = []

    // 오디오 트랙만 분리해서 새 스트림 생성
    const audioTracks = streamRef.current.getAudioTracks()
    const audioStream = new MediaStream(audioTracks)

    const mimeType = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      '',
    ].find(type => type === '' || MediaRecorder.isTypeSupported(type))

    try {
      const mediaRecorder = new MediaRecorder(
        audioStream,
        mimeType ? { mimeType } : {}
      )

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      console.log('녹음 시작! mimeType:', mediaRecorder.mimeType)
    } catch (err) {
      console.error('MediaRecorder 생성 실패:', err)
    }
  }

  // 녹음 종료 -> STT 호출 -> 결과 저장
  // questionId를 인자로 받아 onstop 비동기 시점에도 저장 대상 질문을 고정
  const stopRecordingAndTranscribe = useCallback((questionId) => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        resolve(null)
        return
      }

      mediaRecorder.onstop = async () => {
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm'
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })

        // 녹음 데이터가 너무 작으면 STT 스킵
        if (audioBlob.size < 1000) {
          resolve(null)
          return
        }

        setSttLoading(true)
        try {
          // aiService STT 호출
          const sttResult = await transcribeAudio(audioBlob)

          // interviewService 답변 저장
          await saveAnswer(
            session.sessionId,
            questionId,
            {
              answerText: sttResult.answerText,
              answerDuration: sttResult.answerDuration,
              wpm: sttResult.wpm,
              silenceRatio: sttResult.silenceRatio,
              asrConfidence: sttResult.asrConfidence,
              fillerCount: sttResult.fillerCount,
              fillerRatio: sttResult.fillerRatio,
            }
          )
          resolve(sttResult)
        } catch (err) {
          console.error('STT 처리 실패:', err)
          resolve(null)
        } finally {
          setSttLoading(false)
        }
      }

      mediaRecorder.stop()
    })
  }, [session?.sessionId])

  // 답변 시작
  const handleStartAnswer = () => {
    clearInterval(timerRef.current)
    setPhase(PHASE.ANSWERING)
    setTimeLeft(ANSWER_TIME)
    startRecording()  // 녹음 시작
  }

  // 답변 종료
  const handleEndAnswer = async () => {
    clearInterval(timerRef.current)
    setPhase(PHASE.ENDED)
    setTimeLeft(0)
    await stopRecordingAndTranscribe(currentQuestion.sessionQuestionId)  // 녹음 종료 + STT
  }

  // 건너뛰기 (녹음 중이면 종료)
  const handleSkip = async () => {
    clearInterval(timerRef.current)
    if (mediaRecorderRef.current?.state === 'recording') {
      // 녹음 저장 완료를 기다린 뒤 다음 질문으로 이동 (질문, 답변 매핑 보장)
      await stopRecordingAndTranscribe(currentQuestion.sessionQuestionId)
    }
    goNextQuestion()
  }

  // 다시 답변
  const handleRetry = () => {
    setPhase(PHASE.PREP)
    setTimeLeft(PREP_TIME)
  }

  // 다음 질문
  const goNextQuestion = () => {
    if (isLastQuestion) {
      stopStream()
      navigate(`/interview/result/${session.sessionId}`, { state: { session } })
      return
    }
    setCurrentIdx((prev) => prev + 1)
    setPhase(PHASE.PREP)
    setTimeLeft(PREP_TIME)
  }

  // 바로 분석
  const handleDirectAnalysis = () => {
    stopStream()
    navigate(`/interview/result/${session.sessionId}`, { state: { session } })
  }

  const getTimerColor = () => {
    if (phase === PHASE.PREP) return '#bbb'
    if (phase === PHASE.WARNING || phase === PHASE.ENDED) return '#e53935'
    return '#f9a825'
  }

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0')
    const s = String(sec % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  if (!session || !currentQuestion) return null

  return (
    <div className="is-page">
      {/* 헤더 */}
      <header className="is-header">
        <button className="is-back" onClick={() => { stopStream(); navigate(-1) }}>‹</button>
        <span className="is-header-title">AlgoTalk</span>
      </header>

      <div className="is-container">
        {/* 질문 */}
        <p className="is-question">
          Qn. {currentQuestion.questionText}
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
            {phase === PHASE.PREP ? '답변 준비 시간' : '남은 답변 시간'}
          </span>
        </div>

        {/* STT 처리 중 로딩 */}
        {sttLoading && (
          <div className="is-stt-loading">
            🎙️ 답변을 분석하고 있습니다...
          </div>
        )}

        {/* 버튼 영역 */}
        <div className="is-btn-wrap">
          {phase === PHASE.PREP && (
            <>
              <button className="is-btn-skip" onClick={handleSkip}>건너뛰기</button>
              <button className="is-btn-main" onClick={handleStartAnswer}>답변 시작</button>
            </>
          )}
          {(phase === PHASE.ANSWERING || phase === PHASE.WARNING) && (
            <>
              <button className="is-btn-skip" onClick={handleSkip}>건너뛰기</button>
              <button className="is-btn-main" onClick={handleEndAnswer}>답변 종료</button>
            </>
          )}
          {phase === PHASE.ENDED && (
            <>
              <button className="is-btn-skip" onClick={handleRetry} disabled={sttLoading}>다시 답변</button>
              <button className="is-btn-main" onClick={goNextQuestion} disabled={sttLoading}>
                {isLastQuestion ? '결과 보기' : '다음 질문'}
              </button>
            </>
          )}
        </div>

        {/* 기타 옵션 */}
        {phase === PHASE.ENDED && (
          <div className="is-extra-opts">
            <div className="is-divider"><span>기타 옵션</span></div>
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
  )
}