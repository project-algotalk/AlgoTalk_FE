// src/components/common/Navbar.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const { isLoggedIn, user, clearAuth } = useAuthStore()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = () => {
    // TODO: 서버 로그아웃 API 호출
    clearAuth()
    setShowLogoutModal(false)
    navigate('/')
  }

  return (
    <>
      <nav className="navbar">
        {/* 로고 */}
        <Link to="/" className="navbar-logo">AlgoTalk</Link>

        {/* 메뉴 */}
        <div className="navbar-menu">
          <Link to="/interview" className="navbar-link">면접 보기</Link>
          <Link to="/board" className="navbar-link">게시판</Link>
          <Link to="/dashboard" className="navbar-link">dashboard</Link>

          {isLoggedIn ? (
            <>
              <Link to="/mypage" className="navbar-link navbar-username">
                {user?.nickname}님
              </Link>
              <button
                className="navbar-btn"
                onClick={() => setShowLogoutModal(true)}
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              className="navbar-btn"
              onClick={() => navigate('/login')}
            >
              로그인
            </button>
          )}
        </div>
      </nav>

      {/* 로그아웃 모달 */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" stroke="#1a7f4b" strokeWidth="2.5" />
                <path
                  d="M14 24l7 7 13-14"
                  stroke="#1a7f4b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="modal-title">로그아웃</h2>
            <p className="modal-desc">{user?.nickname}님 안녕히가세요!</p>
            <button className="modal-confirm-btn" onClick={handleLogout}>
              확인
            </button>
          </div>
        </div>
      )}
    </>
  )
}