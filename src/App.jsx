// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PrivateRoute from './components/common/PrivateRoute'
import SignupStepGuard from './components/common/SignupStepGuard'
import useAuthStore from './store/authStore'
import { fetchMe } from './api/authApi'
// Auth
import LoginPage from './pages/auth/LoginPage'
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage'
import OAuthSignupPage from './pages/auth/OAuthSignupPage'
import SignupStep1Page from './pages/auth/SignupStep1Page'
import SignupStep2Page from './pages/auth/SignupStep2Page'
import SignupStep3Page from './pages/auth/SignupStep3Page'
import SignupCompletePage from './pages/auth/SignupCompletePage'
import FindAccountPage from './pages/auth/FindAccountPage'

// Interview
import InterviewStartPage from './pages/interview/InterviewStartPage'
import InterviewNewPage from './pages/interview/InterviewNewPage'
import DeviceCheckPage from './pages/interview/DeviceCheckPage'
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
  const { login, logout, setUnauthenticated } = useAuthStore()
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
        const isLoggedOut = sessionStorage.getItem('logged-out')
        if (isLoggedOut) {
            logout()
            setInitializing(false)
            return
        }

        const currentStatus = useAuthStore.getState().authStatus
        // unauthenticated면 이미 실패한 거니까 재시도 안 함
        if (currentStatus === 'authenticated' || currentStatus === 'unauthenticated') {
            setInitializing(false)
            return
        }
        
        // checking 상태일 때만 (최초 방문 시) fetchMe() 호출
        try {
            const me = await fetchMe()
            if (!me) throw new Error('ME_EMPTY')
            login({ user: me })
        } catch {
            setUnauthenticated()
        } finally {
            setInitializing(false)
        }
    }

    const handleStorageChange = (e) => {
      // 다른 탭에서 로그아웃 신호가 왔을 때
      if (e.key === 'logout-signal') {
        logout()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    restoreSession()

    return () => window.removeEventListener('storage', handleStorageChange)
  }, [login, logout, setUnauthenticated])

  if (initializing) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40vh',
        color: '#888',
        fontSize: '0.95rem',
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
        <Route path="/find-id" element={<FindAccountPage />} />
        <Route path="/find-password" element={<FindAccountPage />} />

        {/* 게시판 열람은 비로그인 가능 */}
        <Route path="/board" element={<BoardPage />} />
        <Route path="/board/:postId" element={<BoardDetailPage />} />

        {/* 로그인 필요 */}
        <Route element={<PrivateRoute />}>
          <Route path="/interview" element={<InterviewStartPage />} />
          <Route path="/interview/new" element={<InterviewNewPage />} />
          <Route path="/interview/device-check" element={<DeviceCheckPage />} />
          <Route path="/interview/session" element={<InterviewSessionPage />} />
          <Route path="/interview/result/:sessionId" element={<InterviewResultPage />} />
          <Route path="/interview/result/:sessionId/questions/:qNo" element={<InterviewFeedbackPage />} />
          <Route path="/board/write" element={<BoardWritePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/oauth2/link/success" element={<OAuthCallbackPage />} />
          <Route path="/oauth2/link/failure" element={<OAuthCallbackPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}


