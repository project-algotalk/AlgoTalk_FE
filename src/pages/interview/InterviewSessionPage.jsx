import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)

  const currentQuestion = questions[currentIdx]
  const isLastQuestion = currentIdx === questions.length - 1

  // 세션 없으면 면접 시작 페이지로
  useEffect(() => {
    if (!session) {
      navigate('/interview', { replace: true })
    }
  }, [session, navigate])

  // 카메라 스트림 시작
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
    return () => stopStream()
  }, [])

  // 타이머
  useEffect(() => {
    clearInterval(timerRef.current)

    if (phase === PHASE.ENDED) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleTimeUp()
          return 0
        }
        // 답변 중 30초 이하 경고
        if (phase === PHASE.ANSWERING && prev - 1 <= WARNING_TIME) {
          setPhase(PHASE.WARNING)
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [phase])

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  // 시간 초과 처리
  const handleTimeUp = () => {
    if (phase === PHASE.PREP) {
      // 준비 시간 완료 → 답변 시작
      setPhase(PHASE.ANSWERING)
      setTimeLeft(ANSWER_TIME)
    } else {
      // 답변 시간 완료
      setPhase(PHASE.ENDED)
      setTimeLeft(0)
    }
  }

  // 답변 시작
  const handleStartAnswer = () => {
    clearInterval(timerRef.current)
    setPhase(PHASE.ANSWERING)
    setTimeLeft(ANSWER_TIME)
  }

  // 답변 종료
  const handleEndAnswer = () => {
    clearInterval(timerRef.current)
    setPhase(PHASE.ENDED)
    setTimeLeft(0)
  }

  // 건너뛰기
  const handleSkip = () => {
    clearInterval(timerRef.current)
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
      // 마지막 질문 → 결과 페이지
      stopStream()
      navigate(`/interview/result/${session.sessionId}`, { state: { session } })
      return
    }
    setCurrentIdx((prev) => prev + 1)
    setPhase(PHASE.PREP)
    setTimeLeft(PREP_TIME)
  }

  // 바로 분석 (남은 질문 전부 스킵)
  const handleDirectAnalysis = () => {
    stopStream()
    navigate(`/interview/result/${session.sessionId}`, { state: { session } })
  }

  // 타이머 색상
  const getTimerColor = () => {
    if (phase === PHASE.PREP) return '#bbb'
    if (phase === PHASE.WARNING || phase === PHASE.ENDED) return '#e53935'
    return '#f9a825'
  }

  // 시간 포맷 (MM:SS)
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
          {/* 녹화 중 표시 */}
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
              <button className="is-btn-skip" onClick={handleRetry}>다시 답변</button>
              <button className="is-btn-main" onClick={goNextQuestion}>
                {isLastQuestion ? '결과 보기' : '다음 질문'}
              </button>
            </>
          )}
        </div>

        {/* 기타 옵션 (ENDED 상태에서만) */}
        {phase === PHASE.ENDED && (
          <div className="is-extra-opts">
            <div className="is-divider"><span>기타 옵션</span></div>
            <button className="is-direct-analysis" onClick={handleDirectAnalysis}>
              바로 분석(남은 질문 전부 스킵)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}