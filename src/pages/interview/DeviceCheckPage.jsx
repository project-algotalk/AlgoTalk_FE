import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

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
      {/* 헤더 */}
      <header className="dc-header">
        <button className="dc-back" onClick={() => { stopStream(); navigate(-1) }}>‹</button>
        <span className="dc-header-title">AlgoTalk</span>
      </header>

      <div className="dc-container">
        <h1 className="dc-title">장치 설정 확인하기</h1>
        <p className="dc-subtitle">면접 시작 전 카메라와 마이크가 정상 작동하는지 확인합니다.</p>

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
              {cameraStatus === 'error' ? '카메라를 사용할 수 없습니다.' : '카메라 미리보기'}
            </div>
          )}
          {cameraStatus === 'ok' && (
            <div className="dc-rec-dot" />
          )}
        </div>

        <p className="dc-hint">장치 문제시 브라우저에서 권한을 확인하세요.</p>

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
            📷 카메라 체크
            {cameraStatus === 'ok' && ' ✓'}
            {cameraStatus === 'error' && ' ✗'}
          </button>
          <button
            className={`dc-check-btn ${micStatus === 'ok' ? 'ok' : micStatus === 'error' ? 'error' : ''}`}
            onClick={handleMicCheck}
          >
            🎤 마이크 체크
            {micStatus === 'ok' && ' ✓'}
            {micStatus === 'error' && ' ✗'}
          </button>
        </div>

        {/* 하단 버튼 */}
        <div className="dc-footer">
          <button className="dc-prev-btn" onClick={() => { stopStream(); navigate(-1) }}>
            이 전
          </button>
          <button
            className="dc-start-btn"
            onClick={handleStart}
            disabled={!isDeviceReady}
            title={!isDeviceReady ? '카메라와 마이크 체크를 완료해주세요.' : ''}
          >
            면접 시작
          </button>
        </div>
      </div>
    </div>
  )
}