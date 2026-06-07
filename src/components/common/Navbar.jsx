import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import api from '../../api/axiosInstance'
import styled from 'styled-components'
import AlertModal from './AlertModal'

const Nav = styled.nav`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 56px;
  background: #ffffff;
  border-bottom: 1px solid #e8edf5;
  position: sticky;
  top: 0;
  z-index: 100;
  box-sizing: border-box;
`

const Logo = styled(Link)`
  font-size: 1.3rem;
  font-weight: 800;
  color: #0F2854;
  text-decoration: none;
  letter-spacing: -0.5px;
`

const Menu = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;

  @media (max-width: 650px) {
    display: none;
  }
`

const NavLink = styled(Link)`
  font-size: 0.9rem;
  color: #444;
  text-decoration: none;
  transition: color 0.15s;

  &:hover {
    color: #1C4D8D;
  }
`

const NavLinkUser = styled(NavLink)`
  color: #1C4D8D;
  font-weight: 600;
`

const NavBtn = styled.button`
  background: #0F2854;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
  transition: background 0.15s;

  &:hover {
    background: #1C4D8D;
  }
`

const Hamburger = styled.button`
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;

  span {
    display: block;
    width: 22px;
    height: 2px;
    background: #0F2854;
    border-radius: 2px;
  }

  @media (max-width: 650px) {
    display: flex;
  }
`

const MobileMenu = styled.div`
  display: none;
  flex-direction: column;
  background: #fff;
  border-bottom: 1px solid #e8edf5;
  padding: 12px 24px;
  gap: 4px;
  position: sticky;
  top: 56px;
  z-index: 99;

  @media (max-width: 650px) {
    display: flex;
  }
`

const MobileLink = styled(Link)`
  font-size: 0.9rem;
  color: #444;
  text-decoration: none;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-of-type {
    border-bottom: none;
  }
`

const MobileBtn = styled.button`
  background: #0F2854;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 18px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
  margin-top: 8px;
  width: 100%;

  &:hover {
    background: #1C4D8D;
  }
`

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
      <Nav>
        <Logo to="/">AlgoTalk</Logo>

        <Hamburger
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="메뉴 열기"
        >
          <span />
          <span />
          <span />
        </Hamburger>

        <Menu>
          <NavLink to="/interview">면접 보기</NavLink>
          <NavLink to="/board">게시판</NavLink>
          <NavLink to="/dashboard">대시보드</NavLink>
          {isLoggedIn ? (
            <>
              <NavLinkUser to="/mypage">{user?.nickname}님</NavLinkUser>
              <NavBtn onClick={() => setShowLogoutModal(true)}>로그아웃</NavBtn>
            </>
          ) : (
            <NavBtn onClick={() => navigate('/login')}>로그인</NavBtn>
          )}
        </Menu>
      </Nav>

      {menuOpen && (
        <MobileMenu>
          <MobileLink to="/interview" onClick={() => setMenuOpen(false)}>면접 보기</MobileLink>
          <MobileLink to="/board" onClick={() => setMenuOpen(false)}>게시판</MobileLink>
          <MobileLink to="/dashboard" onClick={() => setMenuOpen(false)}>dashboard</MobileLink>
          {isLoggedIn ? (
            <>
              <MobileLink to="/mypage" onClick={() => setMenuOpen(false)}>{user?.nickname}님</MobileLink>
              <MobileBtn onClick={() => { setMenuOpen(false); setShowLogoutModal(true) }}>로그아웃</MobileBtn>
            </>
          ) : (
            <MobileBtn onClick={() => { setMenuOpen(false); navigate('/login') }}>로그인</MobileBtn>
          )}
        </MobileMenu>
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