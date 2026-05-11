import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import useAuthStore from "../../store/authStore"
import { fetchMe } from "../../api/authApi"

export default function OAuthCallbackPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login, setUnauthenticated } = useAuthStore()

    useEffect(() => {
        const resolveSocialLogin = async () => {
            const isLinkMode = sessionStorage.getItem('oauth2_link_mode') === 'true'

            // 연결 실패
            if (location.pathname === '/oauth2/link/failure') {
                sessionStorage.removeItem('oauth2_link_mode')
                navigate('/mypage', { replace: true, state: { linkError: true } })
                return
            }

            // 연결 성공
            if (isLinkMode) {
                sessionStorage.removeItem('oauth2_link_mode')
                navigate('/mypage', { replace: true, state: { linkSuccess: true } })
                return
            }

            // 기존 로그인 플로우
            try {
                const me = await fetchMe()
                sessionStorage.removeItem('logged-out')
                login({ user: me })
                navigate('/', { replace: true })
            } catch {
                setUnauthenticated()
                navigate('/login', { replace: true })
            }
        }
        resolveSocialLogin()
    }, [login, navigate, setUnauthenticated, location.pathname])

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontSize: '0.9rem',
            color: '#888',
            fontFamily: 'Noto Sans KR, sans-serif',
        }}>
            {sessionStorage.getItem('oauth2_link_mode') === 'true'
                ? '소셜 계정 연결 중...'
                : '로그인 처리 중...'
            }
        </div>
    )
}