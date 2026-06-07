import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import api from '../../api/axiosInstance'
import './Navbar.css'
import AlertModal from './AlertModal'

export default function Navbar() {
  const navigate = useNavigate()
  const { authStatus, user, logout } = useAuthStore()
  const isLoggedIn = authStatus === 'authenticated'
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await api.post('/user/v1/logout')
    } catch (e) {
      // 로그아웃 API 실패해도 프론트 상태는 초기화
      console.error('로그아웃 API 실패:', e)
    } finally {
      sessionStorage.setItem('logged-out', 'true')
      logout()
      setShowLogoutModal(false)
      navigate('/')
    }
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">AlgoTalk</Link>

        {/* 햄버거 버튼 (650px 이하) */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="메뉴 열기"
        >
          <span />
          <span />
          <span />
        </button>

        {/* 데스크탑 메뉴 */}
        <div className="navbar-menu">
          <Link to="/interview" className="navbar-link">면접 보기</Link>
          <Link to="/board" className="navbar-link">게시판</Link>
          <Link to="/dashboard" className="navbar-link">dashboard</Link>
          {isLoggedIn ? (
            <>
              <Link to="/mypage" className="navbar-link navbar-username">
                {user?.nickname}님
              </Link>
              <button className="navbar-btn" onClick={() => setShowLogoutModal(true)}>
                로그아웃
              </button>
            </>
          ) : (
            <button className="navbar-btn" onClick={() => navigate('/login')}>
              로그인
            </button>
          )}
        </div>
      </nav>

      {/* 모바일 드롭다운 메뉴 */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          <Link to="/interview" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>면접 보기</Link>
          <Link to="/board" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>게시판</Link>
          <Link to="/dashboard" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>dashboard</Link>
          {isLoggedIn ? (
            <>
              <Link to="/mypage" className="navbar-mobile-link navbar-username" onClick={() => setMenuOpen(false)}>
                {user?.nickname}님
              </Link>
              <button className="navbar-mobile-btn" onClick={() => { setMenuOpen(false); setShowLogoutModal(true) }}>
                로그아웃
              </button>
            </>
          ) : (
            <button className="navbar-mobile-btn" onClick={() => { setMenuOpen(false); navigate('/login') }}>
              로그인
            </button>
          )}
        </div>
      )}

      {showLogoutModal && (
        <AlertModal
          type="success"
          title="로그아웃"
          message={`${user?.nickname}님 안녕히가세요!`}
          onConfirm={handleLogout}
          onClose={() => setShowLogoutModal(false)}
          align="left"
        />
      )}
    </>
  )
}