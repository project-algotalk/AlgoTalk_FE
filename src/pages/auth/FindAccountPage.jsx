// src/pages/auth/FindAccountPage.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axiosInstance'
import './FindAccountPage.css'
import AlertModal from '../../components/common/AlertModal'

const EMAIL_DOMAINS = [
  'naver.com', 'gmail.com', 'daum.net', 'kakao.com',
  'nate.com', 'hanmail.net', 'outlook.com', '직접입력',
]
const PW_RULE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,16}$/

// ── 아이디 찾기 탭
function FindIdTab() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', emailLocal: '', emailDomain: '', emailDomainCustom: '' })
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [verifyStep, setVerifyStep] = useState('idle')
  const [sentEmail, setSentEmail] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyMessage, setVerifyMessage] = useState('')
  const [verifyMsgType, setVerifyMsgType] = useState('')
  const [modal, setModal] = useState(null)
  const [foundId, setFoundId] = useState('')
  const [foundName, setFoundName] = useState('')

  const isDomainDirect = form.emailDomain === '직접입력'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setErrors(p => ({ ...p, [name]: '' }))
    setGlobalError('')
    if (['emailLocal', 'emailDomainCustom'].includes(name)) {
      setVerifyStep('idle'); setVerifyMessage(''); setSentEmail('')
    }
  }

  const handleDomainChange = (e) => {
    setForm(p => ({ ...p, emailDomain: e.target.value, emailDomainCustom: '' }))
    setVerifyStep('idle'); setVerifyMessage(''); setSentEmail('')
    setErrors(p => ({ ...p, email: '' }))
  }

  const getEmail = () => {
    const domain = isDomainDirect ? form.emailDomainCustom : form.emailDomain
    return `${form.emailLocal}@${domain}`
  }

  const handleEmailVerify = async () => {
    const e = {}
    if (!form.name) e.name = '이름을 입력하세요.'
    if (!form.emailLocal) e.email = '이메일을 입력하세요.'
    else if (!form.emailDomain) e.email = '이메일 도메인을 선택하세요.'
    if (Object.keys(e).length > 0) { setErrors(e); return }

    setVerifyStep('sending')
    setErrors(p => ({ ...p, email: '' }))
    const email = getEmail()
    try {
      await api.post('/user/v1/find/loginId/email-code', { name: form.name, email })
      setSentEmail(email)
      setVerifyStep('code_sent')
      setModal({ type: 'success', title: '인증코드 전송 완료', message: '이메일로 전송된 인증코드를 확인해 주세요.', onConfirm: () => setModal(null) })
    } catch (err) {
      setVerifyStep('idle')
      setModal({ type: 'error', message: err.response?.data?.message || '인증코드 전송에 실패했습니다.', onConfirm: () => setModal(null) })
    }
  }

  const handleVerifyConfirm = async () => {
    if (!verifyCode || verifyCode.length !== 6) {
      setErrors(p => ({ ...p, verifyCode: '인증코드를 입력하세요.' })); return
    }
    setErrors(p => ({ ...p, verifyCode: '' }))
    try {
      await api.post('/user/v1/find/loginId/verify-code', { email: sentEmail, authNumber: verifyCode })
      setVerifyStep('verified')
      setVerifyMessage('이메일 인증 완료')
      setVerifyMsgType('success')
      setModal({ type: 'success', message: '이메일 인증에 성공했습니다.', onConfirm: () => setModal(null) })
    } catch (err) {
      setVerifyStep('failed')
      setVerifyMsgType('error')
      setVerifyMessage('이메일 인증을 다시 시도하세요.')
      setModal({ type: 'error', message: err.response?.data?.message || '인증에 실패했습니다.', onConfirm: () => setModal(null) })
    }
  }

  const handleFind = async () => {
    if (verifyStep !== 'verified') {
      setErrors(p => ({ ...p, email: '이메일 인증을 수행하세요.' })); return
    }
    try {
      const { data } = await api.post('/user/v1/find/loginId', { name: form.name, email: sentEmail })
      setFoundId(data.data.loginId)
      setFoundName(form.name)
      setGlobalError('')
    } catch (err) {
      setGlobalError(err.response?.data?.message || '존재하지 않는 회원 입니다.')
      setFoundId('')
    }
  }

  const emailBtnText = () => {
    if (verifyStep === 'sending') return '전송 중...'
    if (verifyStep === 'failed') return '재발송'
    return '이메일 인증'
  }

  return (
    <div>
      {foundId ? (
        <div className="fa-result">
          <p className="fa-result-text">
            <span className="fa-result-name">{foundName}</span>님의 아이디는&nbsp;
            <span className="fa-result-id">{foundId}</span> 입니다.
          </p>
          <button className="fa-submit-btn" onClick={() => navigate('/login')}>로그인</button>
        </div>
      ) : (
        <>
          {globalError && <p className="fa-global-error">{globalError}</p>}

          <div className="fa-field">
            <label className="fa-label">이름 <span className="fa-required">*</span></label>
            <input
              className={`fa-input ${errors.name ? 'fa-input--error' : ''}`}
              type="text" name="name"
              placeholder="회원가입시 등록한 이름을 입력해주세요."
              value={form.name} onChange={handleChange}
              disabled={verifyStep === 'verified'}
            />
            {errors.name && <p className="fa-hint fa-hint--error">{errors.name}</p>}
          </div>

          <div className="fa-field">
            <label className="fa-label">이메일 <span className="fa-required">*</span></label>
            <div className="fa-email-row">
              <input
                className={`fa-input fa-email-local ${errors.email ? 'fa-input--error' : ''}`}
                type="text" name="emailLocal"
                placeholder="회원가입시 등록한 이메일을 입력해주세요."
                value={form.emailLocal} onChange={handleChange}
                disabled={verifyStep === 'verified'}
              />
              <span className="fa-at">@</span>
              {isDomainDirect && (
                <input
                  className="fa-input fa-email-domain-input"
                  type="text" name="emailDomainCustom"
                  value={form.emailDomainCustom} onChange={handleChange}
                  disabled={verifyStep === 'verified'}
                />
              )}
              <div className="fa-select-wrap">
                <select className="fa-select" value={form.emailDomain} onChange={handleDomainChange} disabled={verifyStep === 'verified'}>
                  <option value="">선택해 주세요.</option>
                  {EMAIL_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button
                className="fa-side-btn" type="button"
                onClick={handleEmailVerify}
                disabled={verifyStep === 'sending' || verifyStep === 'verified'}
              >
                {emailBtnText()}
              </button>
            </div>
            {errors.email && <p className="fa-hint fa-hint--error">{errors.email}</p>}

            {['code_sent', 'verifying', 'verified', 'failed'].includes(verifyStep) && (
              <>
                {verifyMessage && (
                  <p className={`fa-hint ${verifyMsgType === 'success' ? 'fa-hint--ok' : 'fa-hint--error'}`}>
                    {verifyMessage}
                  </p>
                )}
                <div className="fa-input-row" style={{ marginTop: 8 }}>
                  <input
                    className={`fa-input ${errors.verifyCode ? 'fa-input--error' : ''}`}
                    type="text"
                    placeholder="인증코드 6자리를 입력해 주세요."
                    value={verifyCode}
                    onChange={e => { setVerifyCode(e.target.value); setErrors(p => ({ ...p, verifyCode: '' })) }}
                    disabled={verifyStep === 'verified'}
                    maxLength={6}
                  />
                  <button className="fa-side-btn" type="button" onClick={handleVerifyConfirm} disabled={verifyStep === 'verified'}>
                    인증하기
                  </button>
                </div>
                {errors.verifyCode && <p className="fa-hint fa-hint--error">{errors.verifyCode}</p>}
              </>
            )}
          </div>

          <button className="fa-submit-btn" type="button" onClick={handleFind}>
            아이디 찾기
          </button>
        </>
      )}

      {modal && <AlertModal type={modal.type} title={modal.title} message={modal.message} onConfirm={modal.onConfirm} onClose={modal.onConfirm} align="center" zIndex={1000} />}    </div>
  )
}

// ── 비밀번호 찾기 탭
function FindPasswordTab() {
  const navigate = useNavigate()
  const [step, setStep] = useState('verify')

  const [form, setForm] = useState({ loginId: '', name: '', emailLocal: '', emailDomain: '', emailDomainCustom: '' })
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [verifyStep, setVerifyStep] = useState('idle')
  const [sentEmail, setSentEmail] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyMessage, setVerifyMessage] = useState('')
  const [verifyMsgType, setVerifyMsgType] = useState('')
  const [modal, setModal] = useState(null)
  const [foundName, setFoundName] = useState('')

  const [pwForm, setPwForm] = useState({ newPassword: '', newPasswordConfirm: '' })
  const [pwErrors, setPwErrors] = useState({})
  const [pwLoading, setPwLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const isDomainDirect = form.emailDomain === '직접입력'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setErrors(p => ({ ...p, [name]: '' }))
    setGlobalError('')
    if (['emailLocal', 'emailDomainCustom'].includes(name)) {
      setVerifyStep('idle'); setVerifyMessage(''); setSentEmail('')
    }
  }

  const handleDomainChange = (e) => {
    setForm(p => ({ ...p, emailDomain: e.target.value, emailDomainCustom: '' }))
    setVerifyStep('idle'); setVerifyMessage(''); setSentEmail('')
    setErrors(p => ({ ...p, email: '' }))
  }

  const getEmail = () => {
    const domain = isDomainDirect ? form.emailDomainCustom : form.emailDomain
    return `${form.emailLocal}@${domain}`
  }

  const handleEmailVerify = async () => {
    const e = {}
    if (!form.loginId) e.loginId = '아이디를 입력하세요.'
    if (!form.name) e.name = '이름을 입력하세요.'
    if (!form.emailLocal) e.email = '이메일을 입력하세요.'
    else if (!form.emailDomain) e.email = '이메일 도메인을 선택하세요.'
    if (Object.keys(e).length > 0) { setErrors(e); return }

    setVerifyStep('sending')
    setGlobalError('')
    setErrors(p => ({ ...p, email: '' }))
    const email = getEmail()
    try {
      await api.post('/user/v1/find/password/email-code', { loginId: form.loginId, name: form.name, email })
      setSentEmail(email)
      setVerifyStep('code_sent')
      setModal({ type: 'success', title: '인증코드 전송 완료', message: '이메일로 전송된 인증코드를 확인해 주세요.', onConfirm: () => setModal(null) })
    } catch (err) {
      setVerifyStep('idle')
      const msg = err.response?.data?.message || '존재하지 않는 회원 입니다.'
      setGlobalError(msg)
      setForm({ loginId: '', name: '', emailLocal: '', emailDomain: '', emailDomainCustom: '' })
    }
  }

  const handleVerifyConfirm = async () => {
    if (!verifyCode || verifyCode.length !== 6) {
      setErrors(p => ({ ...p, verifyCode: '인증코드를 입력하세요.' })); return
    }
    setErrors(p => ({ ...p, verifyCode: '' }))
    try {
      await api.post('/user/v1/find/password/verify-code', { email: sentEmail, authNumber: verifyCode })
      setVerifyStep('verified')
      setVerifyMessage('이메일 인증 완료')
      setVerifyMsgType('success')
      setModal({ type: 'success', message: '이메일 인증에 성공했습니다.', onConfirm: () => setModal(null) })
    } catch (err) {
      setVerifyStep('failed')
      setVerifyMsgType('error')
      setVerifyMessage('이메일 인증을 다시 시도하세요.')
      setModal({ type: 'error', message: err.response?.data?.message || '인증에 실패했습니다.', onConfirm: () => setModal(null) })
    }
  }

  const handleFind = () => {
    if (verifyStep !== 'verified') {
      setErrors(p => ({ ...p, email: '이메일 인증을 수행하세요.' })); return
    }
    setFoundName(form.name)
    setStep('reset')
  }

  const handlePwChange = (e) => {
    const { name, value } = e.target
    setPwForm(p => ({ ...p, [name]: value }))
    setPwErrors(p => ({ ...p, [name]: '' }))
  }

  const handleReset = async () => {
    const e = {}
    if (!pwForm.newPassword) e.newPassword = '새로운 비밀번호를 입력하세요.'
    else if (!PW_RULE.test(pwForm.newPassword)) e.newPassword = '영문, 숫자, 특수문자 조합 8~16자'
    if (!pwForm.newPasswordConfirm) e.newPasswordConfirm = '비밀번호를 확인하세요.'
    else if (pwForm.newPassword !== pwForm.newPasswordConfirm) e.newPasswordConfirm = '비밀번호가 일치하지 않습니다.'
    if (Object.keys(e).length > 0) { setPwErrors(e); return }

    setPwLoading(true)
    try {
      await api.post('/user/v1/find/password/reset', {
        email: sentEmail,
        newPassword: pwForm.newPassword,
        newPasswordConfirm: pwForm.newPasswordConfirm,
      })
      setShowSuccessModal(true)
    } catch (err) {
      setPwErrors({ newPassword: err.response?.data?.message || '비밀번호 변경에 실패했습니다.' })
    } finally {
      setPwLoading(false)
    }
  }

  const emailBtnText = () => {
    if (verifyStep === 'sending') return '전송 중...'
    if (verifyStep === 'failed') return '재발송'
    return '이메일 인증'
  }

  return (
    <div>
      {step === 'verify' ? (
        <>
          {globalError && <p className="fa-global-error">{globalError}</p>}

          <div className="fa-field">
            <label className="fa-label">아이디 <span className="fa-required">*</span></label>
            <input
              className={`fa-input ${errors.loginId ? 'fa-input--error' : ''}`}
              type="text" name="loginId"
              placeholder="회원가입시 등록한 아이디를 입력해주세요."
              value={form.loginId} onChange={handleChange}
              disabled={verifyStep === 'verified'}
            />
            {errors.loginId && <p className="fa-hint fa-hint--error">{errors.loginId}</p>}
          </div>

          <div className="fa-field">
            <label className="fa-label">이름 <span className="fa-required">*</span></label>
            <input
              className={`fa-input ${errors.name ? 'fa-input--error' : ''}`}
              type="text" name="name"
              placeholder="회원가입시 등록한 이름을 입력해주세요."
              value={form.name} onChange={handleChange}
              disabled={verifyStep === 'verified'}
            />
            {errors.name && <p className="fa-hint fa-hint--error">{errors.name}</p>}
          </div>

          <div className="fa-field">
            <label className="fa-label">이메일 <span className="fa-required">*</span></label>
            <div className="fa-email-row">
              <input
                className={`fa-input fa-email-local ${errors.email ? 'fa-input--error' : ''}`}
                type="text" name="emailLocal"
                placeholder="회원가입시 등록한 이메일을 입력해주세요."
                value={form.emailLocal} onChange={handleChange}
                disabled={verifyStep === 'verified'}
              />
              <span className="fa-at">@</span>
              {isDomainDirect && (
                <input
                  className="fa-input fa-email-domain-input"
                  type="text" name="emailDomainCustom"
                  value={form.emailDomainCustom} onChange={handleChange}
                  disabled={verifyStep === 'verified'}
                />
              )}
              <div className="fa-select-wrap">
                <select className="fa-select" value={form.emailDomain} onChange={handleDomainChange} disabled={verifyStep === 'verified'}>
                  <option value="">선택해 주세요.</option>
                  {EMAIL_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button
                className="fa-side-btn" type="button"
                onClick={handleEmailVerify}
                disabled={verifyStep === 'sending' || verifyStep === 'verified'}
              >
                {emailBtnText()}
              </button>
            </div>
            {errors.email && <p className="fa-hint fa-hint--error">{errors.email}</p>}

            {['code_sent', 'verifying', 'verified', 'failed'].includes(verifyStep) && (
              <>
                {verifyMessage && (
                  <p className={`fa-hint ${verifyMsgType === 'success' ? 'fa-hint--ok' : 'fa-hint--error'}`}>
                    {verifyMessage}
                  </p>
                )}
                <div className="fa-input-row" style={{ marginTop: 8 }}>
                  <input
                    className={`fa-input ${errors.verifyCode ? 'fa-input--error' : ''}`}
                    type="text"
                    placeholder="인증코드 6자리를 입력해 주세요."
                    value={verifyCode}
                    onChange={e => { setVerifyCode(e.target.value); setErrors(p => ({ ...p, verifyCode: '' })) }}
                    disabled={verifyStep === 'verified'}
                    maxLength={6}
                  />
                  <button className="fa-side-btn" type="button" onClick={handleVerifyConfirm} disabled={verifyStep === 'verified'}>
                    인증하기
                  </button>
                </div>
                {errors.verifyCode && <p className="fa-hint fa-hint--error">{errors.verifyCode}</p>}
              </>
            )}
          </div>

          <button className="fa-submit-btn" type="button" onClick={handleFind}>
            비밀번호 찾기
          </button>
        </>
      ) : (
        <>
          <p className="fa-reset-title">
            <strong>{foundName}</strong> 회원님 비밀번호를 변경해 주세요.
          </p>

          <div className="fa-field">
            <label className="fa-label">새로운 비밀번호 <span className="fa-required">*</span></label>
            <input
              className={`fa-input ${pwErrors.newPassword ? 'fa-input--error' : ''}`}
              type="password" name="newPassword"
              placeholder="비밀번호를 입력해 주세요."
              value={pwForm.newPassword} onChange={handlePwChange}
            />
            {pwErrors.newPassword
              ? <p className="fa-hint fa-hint--error">{pwErrors.newPassword}</p>
              : <p className="fa-hint">영문, 숫자, 특수문자 조합 8~16자</p>
            }
          </div>

          <div className="fa-field">
            <label className="fa-label">비밀번호 확인 <span className="fa-required">*</span></label>
            <input
              className={`fa-input ${pwErrors.newPasswordConfirm ? 'fa-input--error' : ''}`}
              type="password" name="newPasswordConfirm"
              placeholder="비밀번호를 다시 입력해 주세요."
              value={pwForm.newPasswordConfirm} onChange={handlePwChange}
            />
            {pwErrors.newPasswordConfirm && (
              <p className="fa-hint fa-hint--error">{pwErrors.newPasswordConfirm}</p>
            )}
          </div>

          <button className="fa-submit-btn" type="button" onClick={handleReset} disabled={pwLoading}>
            {pwLoading ? '처리 중...' : '비밀번호 변경'}
          </button>

          {/* <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <Link to="/login" style={{ fontSize: '0.85rem', color: '#6b7280', textDecoration: 'none' }}>
              로그인하기
            </Link>
          </div> */}
        </>
      )}

      {modal && <AlertModal type={modal.type} title={modal.title} message={modal.message} onConfirm={modal.onConfirm} onClose={modal.onConfirm} align="center" zIndex={1000} />}
      {showSuccessModal && (
        <AlertModal
          type="success"
          title="비밀번호 변경 성공"
          message="로그인 페이지로 이동합니다."
          onConfirm={() => navigate('/login')}
        />
      )}
    </div>
  )
}

// ── 메인 페이지
export default function FindAccountPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('id')

  return (
    <div className="fa-page">
      <nav className="fa-nav">
        <button className="fa-nav-close" type="button" onClick={() => navigate(-1)}>✕</button>
        <span className="fa-nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          AlgoTalk
        </span>
        <div style={{ width: 40 }} />
      </nav>

      <div className="fa-container">
        <h1 className="fa-title">ID / PW 찾기</h1>

        <div className="fa-tabs">
          <button className={`fa-tab ${tab === 'id' ? 'active' : ''}`} onClick={() => setTab('id')} type="button">
            아이디
          </button>
          <button className={`fa-tab ${tab === 'password' ? 'active' : ''}`} onClick={() => setTab('password')} type="button">
            비밀번호
          </button>
        </div>

        <div className="fa-content">
          {tab === 'id' ? <FindIdTab /> : <FindPasswordTab />}
        </div>

        <div className="fa-bottom-links">
          <Link to="/signup">회원가입하기</Link>
          <Link to="/login">로그인하기</Link>
        </div>
      </div>
    </div>
  )
}