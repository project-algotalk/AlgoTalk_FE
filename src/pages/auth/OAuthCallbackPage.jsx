import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { decodeJwt } from '../../api/axiosInstance'

export default function OAuthCallbackPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  useEffect(() => {
    // URL fragment에서 AT 추출
    // http://localhost:5173/oauth2/callback#token=eyJ...
    const hash = window.location.hash
    const token = hash.replace('#token=', '')

    if (token) {
      const payload = decodeJwt(token)
      login({
        accessToken: token,
        user: {
          userId:   payload.sub,
          loginId:  payload.loginId,
          nickname: payload.nickname,
          roles:    payload.roles,
        },
      })
      navigate('/', { replace: true })
    } else {
      // 토큰 없으면 로그인 페이지로
    //   navigate('/login', { replace: true })
    }
  }, [])

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', fontSize: '0.9rem', color: '#888',
      fontFamily: 'Noto Sans KR, sans-serif',
    }}>
      로그인 처리 중...
    </div>
  )
}