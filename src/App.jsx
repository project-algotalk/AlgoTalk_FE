// src/App.jsx
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import api, { decodeJwt } from './api/axiosInstance'
import PrivateRoute from './components/common/PrivateRoute'
import SignupStepGuard from './components/common/SignupStepGuard'

// Auth
import LoginPage from './pages/auth/LoginPage'
import OAuthSignupPage from './pages/auth/OAuthSignupPage'
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage'
import SignupStep1Page from './pages/auth/SignupStep1Page'
import SignupStep2Page from './pages/auth/SignupStep2Page'
import SignupStep3Page from './pages/auth/SignupStep3Page'
import SignupCompletePage from './pages/auth/SignupCompletePage'

// Interview
import InterviewStartPage from './pages/interview/InterviewStartPage'
import InterviewNewPage from './pages/interview/InterviewNewPage'
import InterviewSessionPage from './pages/interview/InterviewSessionPage'
import InterviewResultPage from './pages/interview/InterviewResultPage'
import InterviewFeedbackPage from './pages/interview/InterviewFeedbackPage'

// Board
import BoardPage from './pages/board/BoardPage'
import BoardDetailPage from './pages/board/BoardDetailPage'
import BoardWritePage from './pages/board/BoardWritePage'

// Dashboard
import DashboardPage from './pages/dashboard/DashboardPage'

// MyPage
import MyPage from './pages/mypage/MyPage'

// Main
import MainPage from './pages/main/MainPage'

export default function App() {
  const { login, logout } = useAuthStore()
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await api.post('/user/v1/token/reissue')
        const tokenData = data.data
        const payload = decodeJwt(tokenData.accessToken)
        login({
          accessToken: tokenData.accessToken,
          user: {
            userId:   payload.sub,
            loginId:  payload.loginId,
            nickname: payload.nickname,
            roles:    payload.roles,
          },
        })
      } catch {
        logout()
      } finally {
        setInitializing(false)
      }
    }
    restoreSession()
  }, [])

  // 세션 복구 완료 전엔 아무것도 렌더링 안 함
  if (initializing) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', fontSize: '0.9rem', color: '#888',
        fontFamily: 'Noto Sans KR, sans-serif',
      }}>
        로딩 중...
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />

        {/* 인증 불필요 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupStep1Page />} />
        <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />
        <Route path="/oauth2/signup" element={<OAuthSignupPage />} />
        <Route element={<SignupStepGuard requiredKey="signup-step1" />}>
          <Route path="/signup/step2" element={<SignupStep2Page />} />
        </Route>
        <Route element={<SignupStepGuard requiredKey="signup-step2" />}>
          <Route path="/signup/step3" element={<SignupStep3Page />} />
        </Route>
        <Route path="/signup/complete" element={<SignupCompletePage />} />

        {/* 게시판 열람은 비로그인 가능 */}
        <Route path="/board" element={<BoardPage />} />
        <Route path="/board/:postId" element={<BoardDetailPage />} />

        {/* 로그인 필요 */}
        <Route element={<PrivateRoute />}>
          <Route path="/interview" element={<InterviewStartPage />} />
          <Route path="/interview/new" element={<InterviewNewPage />} />
          <Route path="/interview/session" element={<InterviewSessionPage />} />
          <Route path="/interview/result/:sessionId" element={<InterviewResultPage />} />
          <Route path="/interview/result/:sessionId/q/:qNo" element={<InterviewFeedbackPage />} />
          <Route path="/board/write" element={<BoardWritePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}