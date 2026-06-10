import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react'
import styled from 'styled-components'
import useAuthStore from '../../store/authStore'
import api from '../../api/axiosInstance'
import AlertModal from './AlertModal'

const Nav = styled.nav`
  width: 100%;
  height: 64px;
  padding: 0 max(28px, calc((100% - 1180px) / 2));
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-sizing: border-box;
  border-bottom: 1px solid #e8ecf2;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(16px);
`

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #132441;
  text-decoration: none;
  font-size: 1.17rem;
  font-weight: 850;
  letter-spacing: -0.7px;
`

const LogoMark = styled.span`
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
  border-radius: 9px;
  color: white;
  background: linear-gradient(145deg, #7477e5, #4649a9);
  box-shadow: 0 7px 16px rgba(74, 77, 177, .22);

  &::before, &::after {
    content: '';
    width: 3px;
    position: absolute;
    bottom: 7px;
    border-radius: 3px;
    background: currentColor;
  }
  &::before { height: 10px; left: 10px; transform: rotate(-12deg); }
  &::after { height: 16px; right: 10px; transform: rotate(12deg); }
`

const Desktop = styled.div`
  display: flex;
  align-items: center;
  gap: 34px;
  @media (max-width: 720px) { display: none; }
`

const MenuLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const NavLink = styled(Link)`
  min-height: 38px;
  padding: 0 13px;
  display: flex;
  align-items: center;
  border-radius: 9px;
  color: ${({ $active }) => ($active ? '#5053b6' : '#68758a')};
  background: ${({ $active }) => ($active ? '#f0f1ff' : 'transparent')};
  text-decoration: none;
  font-size: .82rem;
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  transition: color .18s ease, background .18s ease;

  &:hover { color: #5053b6; background: #f5f6ff; }
`

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`

const UserLink = styled(Link)`
  min-height: 38px;
  padding: 0 11px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 9px;
  color: #526077;
  text-decoration: none;
  font-size: .78rem;
  font-weight: 700;
  &:hover { background: #f5f7fa; }
`

const NavBtn = styled.button`
  min-height: 39px;
  padding: 0 17px;
  border: 0;
  border-radius: 10px;
  color: white;
  background: #182b4c;
  font: 700 .78rem 'Noto Sans KR', sans-serif;
  cursor: pointer;
  box-shadow: 0 7px 16px rgba(18, 37, 70, .12);
  transition: transform .18s ease, background .18s ease;
  &:hover { background: #5154ba; transform: translateY(-1px); }
`

const Hamburger = styled.button`
  width: 40px;
  height: 40px;
  display: none;
  place-items: center;
  border: 0;
  border-radius: 9px;
  color: #283952;
  background: #f5f7fa;
  cursor: pointer;
  @media (max-width: 720px) { display: grid; }
`

const MobileMenu = styled.div`
  display: none;
  padding: 10px 20px 18px;
  position: sticky;
  top: 64px;
  z-index: 99;
  border-bottom: 1px solid #e8ecf2;
  background: rgba(255,255,255,.98);
  box-shadow: 0 14px 30px rgba(25,39,66,.08);
  @media (max-width: 720px) { display: flex; flex-direction: column; gap: 3px; }
`

const MobileLink = styled(Link)`
  padding: 12px;
  border-radius: 9px;
  color: #526077;
  text-decoration: none;
  font-size: .85rem;
  font-weight: 600;
  &:hover { color: #5053b6; background: #f3f4ff; }
`

const MobileBtn = styled(NavBtn)`
  width: 100%;
  margin-top: 8px;
`

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { authStatus, user, logout } = useAuthStore()
  const isLoggedIn = authStatus === 'authenticated'
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/interview', label: 'AI 면접' },
    { to: '/questions', label: '질문 탐색' },
    { to: '/board', label: '커뮤니티' },
    { to: '/dashboard', label: '리포트' },
  ]

  const isActive = (to) => pathname === to || pathname.startsWith(`${to}/`)

  const handleLogout = async () => {
    try {
      await api.post('/user/v1/logout')
    } catch (error) {
      console.error('로그아웃 API 실패:', error)
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
        <Logo to="/" aria-label="AlgoTalk 홈"><LogoMark />AlgoTalk</Logo>
        <Desktop>
          <MenuLinks>
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} $active={isActive(link.to)}>{link.label}</NavLink>
            ))}
          </MenuLinks>
          <UserActions>
            {isLoggedIn ? (
              <>
                <UserLink to="/mypage">{user?.nickname}님 <ChevronDown size={14} /></UserLink>
                <NavBtn onClick={() => setShowLogoutModal(true)}>로그아웃</NavBtn>
              </>
            ) : (
              <NavBtn onClick={() => navigate('/login')}>로그인</NavBtn>
            )}
          </UserActions>
        </Desktop>
        <Hamburger onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}>
          {menuOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </Hamburger>
      </Nav>

      {menuOpen && (
        <MobileMenu>
          {links.map((link) => (
            <MobileLink key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>{link.label}</MobileLink>
          ))}
          {isLoggedIn ? (
            <>
              <MobileLink to="/mypage" onClick={() => setMenuOpen(false)}>{user?.nickname}님 · 마이페이지</MobileLink>
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
