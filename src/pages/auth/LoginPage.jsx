// src/pages/auth/LoginPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import api from '../../api/axiosInstance'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth, isLoggedIn } = useAuthStore()

  const [form, setForm] = useState({ loginId: '', password: '' })
  const [saveId, setSaveId] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({ loginId: '', password: '' })
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)

  // 이미 로그인 상태면 메인으로
  useEffect(() => {
    if (isLoggedIn) navigate('/', { replace: true })
  }, [isLoggedIn, navigate])

  // 저장된 아이디 불러오기
  useEffect(() => {
    const savedId = localStorage.getItem('algotalk-saved-id')
    if (savedId) {
      setForm((f) => ({ ...f, loginId: savedId }))
      setSaveId(true)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    setGlobalError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFieldErrors({ loginId: '', password: '' })
    setGlobalError('')

    try {
      const { data } = await api.post('/user/v1/login', {
        loginId: form.loginId,
        password: form.password,
      })

      if (saveId) {
        localStorage.setItem('algotalk-saved-id', form.loginId)
      } else {
        localStorage.removeItem('algotalk-saved-id')
      }

      setAuth(data.user, data.accessToken)
      navigate('/', { replace: true })

    } catch (err) {
        console.log('err.response:', err.response)
        console.log('err.response.data:', err.response?.data)
        
        const res = err.response?.data
        console.log('res.code:', res?.code)
        console.log('res.fieldErrors:', res?.fieldErrors)

      if (res?.code === 'VALID_001' && res?.fieldErrors) {
        // 필드별 유효성 에러
        const errors = { loginId: '', password: '' }
        res.fieldErrors.forEach(({ field, reason }) => {
          if (field in errors) errors[field] = reason
        })
        setFieldErrors(errors)
      } else {
        // USER_001, USER_004 등 전체 에러
        setGlobalError(res?.message || '로그인에 실패했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/${provider}`
  }

  return (
    <div className="login-page">

      {/* 로그인 전용 Navbar */}
      <nav className="login-nav">
        <button className="login-nav-close" onClick={() => navigate(-1)}>✕</button>
        <span className="login-nav-logo">AlgoTalk</span>
        <div style={{ width: 40 }} />
      </nav>

      {/* 폼 영역 */}
      <div className="login-container">
        <h1 className="login-title">로그인</h1>

        <form className="login-form" onSubmit={handleLogin} noValidate>

          {/* 아이디 */}
          <div className="login-field">
            <input
              className={`login-input ${fieldErrors.loginId ? 'login-input--error' : ''}`}
              type="text"
              name="loginId"
              placeholder="아이디를 입력해 주세요."
              value={form.loginId}
              onChange={handleChange}
              autoComplete="username"
            />
            {fieldErrors.loginId && (
              <p className="login-error">{fieldErrors.loginId}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="login-field">
            <input
              className={`login-input ${fieldErrors.password ? 'login-input--error' : ''}`}
              type="password"
              name="password"
              placeholder="비밀번호를 입력해 주세요."
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            {fieldErrors.password && (
              <p className="login-error">{fieldErrors.password}</p>
            )}
          </div>

          {/* 전체 에러 (USER_001, USER_004) */}
          {globalError && (
            <p className="login-error login-error--global">{globalError}</p>
          )}

          {/* 아이디 저장 */}
          <label className="login-save-id">
            <input
              type="checkbox"
              checked={saveId}
              onChange={(e) => setSaveId(e.target.checked)}
            />
            아이디 저장
          </label>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="login-btn login-btn--primary"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          {/* 회원가입 버튼 */}
          <button
            type="button"
            className="login-btn login-btn--outline"
            onClick={() => navigate('/signup')}
          >
            회원가입
          </button>

        </form>

        {/* 소셜 로그인 */}
        <div className="login-social">
          <button
            className="social-btn social-btn--google"
            onClick={() => handleSocialLogin('google')}
            type="button"
          >
            <span className="social-icon">G</span>
            구글로 로그인
          </button>

          <button
            className="social-btn social-btn--kakao"
            onClick={() => handleSocialLogin('kakao')}
            type="button"
          >
            <span className="social-icon">💬</span>
            카카오로 로그인
          </button>

          <button
            className="social-btn social-btn--naver"
            onClick={() => handleSocialLogin('naver')}
            type="button"
          >
            <span className="social-icon social-icon--naver">N</span>
            네이버로 로그인
          </button>
        </div>

        {/* 아이디/비밀번호 찾기 */}
        <div className="login-find">
          <Link to="/find-id">아이디 찾기</Link>
          <span className="login-find-divider">|</span>
          <Link to="/find-password">비밀번호 찾기</Link>
        </div>

      </div>
    </div>
  )
}