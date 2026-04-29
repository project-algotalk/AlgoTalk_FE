// src/pages/auth/OAuthSignupPage.jsx
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function OAuthSignupPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const tempToken = searchParams.get('tempToken')

        if (!tempToken) {
        // tempToken 없으면 로그인 페이지로
        navigate('/login', { replace: true })
        return
        }

        // tempToken sessionStorage에 저장
        sessionStorage.setItem('oauth-temp-token', tempToken)

        // Step2(목표직무)로 이동 — step1 데이터 없이 바로
        navigate('/signup/step2', { replace: true })
    }, [navigate, searchParams])

    return (
        <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', fontSize: '0.9rem', color: '#888',
        fontFamily: 'Noto Sans KR, sans-serif',
        }}>
        소셜 회원가입 처리 중...
        </div>
    )
}