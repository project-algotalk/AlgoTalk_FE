// src/pages/auth/LoginPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import api, { decodeJwt } from '../../api/axiosInstance'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, authStatus } = useAuthStore()

  const [form, setForm] = useState({ loginId: '', password: '' })
  const [saveId, setSaveId] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({ loginId: '', password: '' })
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)

  // 이미 로그인 상태면 메인으로
  useEffect(() => {
    if (authStatus === 'authenticated') navigate('/', { replace: true })
  }, [authStatus, navigate])

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

      const tokenData = data.data
      const payload = decodeJwt(tokenData.accessToken)

      if (saveId) {
        localStorage.setItem('algotalk-saved-id', form.loginId)
      } else {
        localStorage.removeItem('algotalk-saved-id')
      }

      login({
        accessToken: tokenData.accessToken,
        user: {
          userId:   payload.sub,
          loginId:  payload.loginId,
          nickname: payload.nickname,
          roles:    payload.roles,
        },
      })

      navigate('/', { replace: true })

    } catch (err) {
      const res = err.response?.data

      if (res?.code === 'VALID_001' && res?.fieldErrors) {
        const errors = { loginId: '', password: '' }
        res.fieldErrors.forEach(({ field, reason }) => {
          if (field in errors) errors[field] = reason
        })
        setFieldErrors(errors)
      } else {
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
        {/* X 버튼: 이전 페이지로 */}
        <button className="login-nav-close" onClick={() => navigate(-1)}>✕</button>
        {/* 로고: 메인으로 */}
        <span
          className="login-nav-logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          AlgoTalk
        </span>
        <div style={{ width: 40 }} />
      </nav>

      <div className="login-container">
        <h1 className="login-title">로그인</h1>

        <form className="login-form" onSubmit={handleLogin} noValidate>

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

          {globalError && (
            <p className="login-error login-error--global">{globalError}</p>
          )}

          <label className="login-save-id">
            <input
              type="checkbox"
              checked={saveId}
              onChange={(e) => setSaveId(e.target.checked)}
            />
            아이디 저장
          </label>

          <button
            type="submit"
            className="login-btn login-btn--primary"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <button
            type="button"
            className="login-btn login-btn--outline"
            onClick={() => navigate('/signup')}
          >
            회원가입
          </button>

        </form>

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

        <div className="login-find">
          <Link to="/find-id">아이디 찾기</Link>
          <span className="login-find-divider">|</span>
          <Link to="/find-password">비밀번호 찾기</Link>
        </div>

      </div>
    </div>
  )
}