import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Camera, Check, Mic2, RotateCcw, ShieldCheck, Sparkles, Video } from 'lucide-react'

export default function DeviceCheckPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const session = location.state?.session

  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const [cameraStatus, setCameraStatus] = useState('idle')   // idle | checking | ok | error
  const [micStatus, setMicStatus] = useState('idle')         // idle | checking | ok | error
  const [micLevel, setMicLevel] = useState(0)

  const isDeviceReady = cameraStatus === 'ok' && micStatus === 'ok'

  // 세션 없으면 뒤로
  useEffect(() => {
    if (!session) {
      navigate('/interview', { replace: true })
    }
  }, [session, navigate])

  // 페이지 나갈 때 스트림 정리
  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [])

  function stopStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  // 카메라 체크
  const handleCameraCheck = async () => {
    setCameraStatus('checking')
    stopStream()
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraStatus('ok')
    } catch {
      setCameraStatus('error')
    }
  }

  // 마이크 체크
  const handleMicCheck = async () => {
    setMicStatus('checking')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      let maxLevel = 0
      let frames = 0

      const checkLevel = () => {
        analyser.getByteFrequencyData(dataArray)
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
        maxLevel = Math.max(maxLevel, avg)
        setMicLevel(Math.min(100, Math.round(avg * 2)))
        frames++
        if (frames < 60) {
          requestAnimationFrame(checkLevel)
        } else {
          stream.getTracks().forEach(t => t.stop())
          audioContext.close()
          setMicLevel(0)
          setMicStatus(maxLevel > 3 ? 'ok' : 'error')
        }
      }
      requestAnimationFrame(checkLevel)
    } catch {
      setMicStatus('error')
    }
  }

  // 면접 시작
  const handleStart = () => {
    if (!isDeviceReady) return

    stopStream()
    navigate('/interview/session', { state: { session } })
  }

  return (
    <div className="dc-page">
      <header className="dc-header">
        <button className="dc-back" onClick={() => { stopStream(); navigate(-1) }} aria-label="이전으로">
          <ArrowLeft size={18} />
        </button>
        <span className="dc-header-title"><i />AlgoTalk <em>DEVICE CHECK</em></span>
      </header>

      <div className="dc-container">
        <div className="dc-heading">
          <span className="dc-eyebrow"><Sparkles size={14} /> READY TO INTERVIEW</span>
          <h1 className="dc-title">면접 전, 장치를<br />마지막으로 확인해 주세요.</h1>
          <p className="dc-subtitle">카메라와 마이크가 정상적으로 작동해야 정확한 AI 피드백을 받을 수 있어요.</p>
        </div>

        {/* 카메라 미리보기 */}
        <div className="dc-preview">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="dc-video"
          />
          {cameraStatus !== 'ok' && (
            <div className="dc-preview-placeholder">
              {cameraStatus === 'error' ? <><Camera size={27} /><span>카메라를 사용할 수 없습니다.</span></> : <><Video size={30} /><span>카메라 체크를 시작해 주세요.</span></>}
            </div>
          )}
          {cameraStatus === 'ok' && (
            <div className="dc-preview-status"><i /> 카메라 연결됨</div>
          )}
        </div>

        <div className="dc-hint"><ShieldCheck size={15} /> 영상과 음성은 면접 분석 목적으로만 사용돼요.</div>

        {/* 마이크 레벨 */}
        {micStatus === 'checking' && (
          <div className="dc-mic-level">
            <div className="dc-mic-bar" style={{ width: `${micLevel}%` }} />
          </div>
        )}

        {/* 체크 버튼 */}
        <div className="dc-check-btns">
          <button
            className={`dc-check-btn ${cameraStatus === 'ok' ? 'ok' : cameraStatus === 'error' ? 'error' : ''}`}
            onClick={handleCameraCheck}
          >
            <span className="dc-check-icon"><Camera size={19} /></span>
            <span><strong>카메라</strong><small>{cameraStatus === 'checking' ? '연결 확인 중...' : cameraStatus === 'ok' ? '정상적으로 연결됐어요' : cameraStatus === 'error' ? '권한을 확인해 주세요' : '화면이 잘 보이는지 확인'}</small></span>
            {cameraStatus === 'ok' ? <Check size={18} /> : <RotateCcw size={16} />}
          </button>
          <button
            className={`dc-check-btn ${micStatus === 'ok' ? 'ok' : micStatus === 'error' ? 'error' : ''}`}
            onClick={handleMicCheck}
          >
            <span className="dc-check-icon"><Mic2 size={19} /></span>
            <span><strong>마이크</strong><small>{micStatus === 'checking' ? '목소리를 들려주세요' : micStatus === 'ok' ? '정상적으로 들려요' : micStatus === 'error' ? '소리를 감지하지 못했어요' : '목소리가 입력되는지 확인'}</small></span>
            {micStatus === 'ok' ? <Check size={18} /> : <RotateCcw size={16} />}
          </button>
        </div>

        {/* 하단 버튼 */}
        <div className="dc-footer">
          <button className="dc-prev-btn" onClick={() => { stopStream(); navigate(-1) }}>
            <ArrowLeft size={17} /> 이전
          </button>
          <button
            className="dc-start-btn"
            onClick={handleStart}
            disabled={!isDeviceReady}
            title={!isDeviceReady ? '카메라와 마이크 체크를 완료해주세요.' : ''}
          >
            면접 시작 <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}