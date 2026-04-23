// src/pages/auth/SignupCompletePage.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './SignupCompletePage.css'

export default function SignupCompletePage() {
  const navigate = useNavigate()

  // 3초 후 로그인 페이지로 이동
  useEffect(() => {
    const timer = setTimeout(() => navigate('/login', { replace: true }), 3000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="sc-page">
      <nav className="sc-nav">
        <span className="sc-nav-logo">AlgoTalk</span>
      </nav>

      <div className="sc-body">
        {/* 체크 아이콘 */}
        <div className="sc-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#1a7f4b" strokeWidth="3" fill="none"/>
            <path
              d="M18 32l10 10 18-18"
              stroke="#1a7f4b"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="sc-title">회원가입 완료!</h1>
        <p className="sc-desc">
          AlgoTalk에 오신 것을 환영합니다.<br />
          지금 바로 AI 면접 연습을 시작해보세요.
        </p>

        <p className="sc-redirect">3초 후 로그인 페이지로 이동합니다.</p>

        <button
          className="sc-btn"
          onClick={() => navigate('/login', { replace: true })}
        >
          로그인하러 가기
        </button>
      </div>
    </div>
  )
}