// src/components/common/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function PrivateRoute() {
  const authStatus = useAuthStore((state) => state.authStatus)

  if (authStatus === 'checking') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', fontSize: '0.9rem', color: '#888',
        fontFamily: 'Noto Sans KR, sans-serif',
      }}>
        로그인 상태 확인 중...
      </div>
    )
  }

  return authStatus === 'authenticated' ? <Outlet /> : <Navigate to="/login" replace />
}