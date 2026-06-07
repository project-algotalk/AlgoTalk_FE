// src/pages/auth/SignupStep1Page.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axiosInstance'
import AlertModal from '../../components/common/AlertModal'

const RULES = {
  loginId:  /^[a-zA-Z0-9]{4,20}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,16}$/,
  name:     /^[가-힣]{2,10}$/,
  nickname: /^[a-zA-Z0-9가-힣]{1,6}$/,
}

const EMAIL_DOMAINS = [
  'naver.com', 'gmail.com', 'daum.net', 'kakao.com',
  'nate.com', 'hanmail.net', 'outlook.com', '직접입력',
]

export default function SignupStep1Page() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    loginId: '', password: '', passwordConfirm: '',
    name: '', nickname: '',
    emailLocal: '', emailDomain: '', emailDomainCustom: '',
    addressBase: '', addressDetail: '',
  })

  const [errors, setErrors]                   = useState({})
  const [idStatus, setIdStatus]               = useState(null)
  const [idChecked, setIdChecked]             = useState(false)
  const [emailVerifyStep, setEmailVerifyStep] = useState('idle')
  const [sentEmail, setSentEmail]             = useState('')
  const [verifyCode, setVerifyCode]           = useState('')
  const [verifyMessage, setVerifyMessage]     = useState('')
  const [verifyMsgType, setVerifyMsgType]     = useState('')
  const [modal, setModal]                     = useState(null)
  const [nicknameStatus, setNicknameStatus]   = useState(null)   // null | 'available' | 'duplicate'

  // 도메인 직접입력 여부 — 함수들보다 위에 선언
  const isDomainDirect = form.emailDomain === '직접입력'

  // 이메일 완성 — 함수들보다 위에 선언
  const getFullEmail = () => {
    const domain = isDomainDirect ? form.emailDomainCustom : form.emailDomain
    return `${form.emailLocal}@${domain}`
  }

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    if (name === 'loginId') { setIdStatus(null); setIdChecked(false) }
    if (name === 'nickname') { setNicknameStatus(null) }
    if (['emailLocal', 'emailDomainCustom'].includes(name)) {
      setEmailVerifyStep('idle')
      setVerifyMessage('')
      setSentEmail('')
    }
  }

  const handleDomainChange = (e) => {
    setForm(prev => ({ ...prev, emailDomain: e.target.value, emailDomainCustom: '' }))
    setEmailVerifyStep('idle')
    setVerifyMessage('')
    setSentEmail('')
    setErrors(prev => ({ ...prev, email: '' }))
  }

  // 아이디 중복확인
  const handleIdCheck = async () => {
    if (!RULES.loginId.test(form.loginId)) {
      setErrors(prev => ({ ...prev, loginId: '아이디를 입력해 주세요. (영문, 숫자 조합 4 ~ 20자)' }))
      return
    }
    try {
      await api.post('/user/v1/reg/check/loginId', { loginId: form.loginId })
      setIdStatus('available')
      setIdChecked(true)
      setModal({
        type: 'success',
        message: '사용 가능한 아이디 입니다.',
        onConfirm: () => setModal(null),
      })
    } catch (err) {
        setIdStatus('duplicate')
        setIdChecked(false)
        setModal({
            type: 'error',
            message: err.response?.data?.message || '이미 사용 중인 아이디입니다.',
            onConfirm: () => { setModal(null); setForm(prev => ({ ...prev, loginId: '' })) },
        })
    }
  }

  // 닉네임 중복확인
  const handleNicknameCheck = async () => {
    if (!form.nickname) {
      setErrors(prev => ({ ...prev, nickname: '닉네임을 입력해 주세요.' }))
      return
    }
    if (!RULES.nickname.test(form.nickname)) {
      setErrors(prev => ({ ...prev, nickname: '공백 및 특수문자 제외, 1~6자' }))
      return
    }
    try {
      await api.post('/user/v1/reg/check/nickname', { nickname: form.nickname })
      setNicknameStatus('available')
      setModal({
        type: 'success',
        message: '사용 가능한 닉네임 입니다.',
        onConfirm: () => setModal(null),
      })
    } catch (err) {
        setNicknameStatus('duplicate')
        setModal({
            type: 'error',
            message: err.response?.data?.message || '이미 사용 중인 닉네임입니다.',
            onConfirm: () => { setModal(null); setForm(prev => ({ ...prev, nickname: '' })) },
        })
    }
  }

  // 이메일 인증 요청
  const handleEmailVerify = async () => {
    if (!form.emailLocal) {
      setErrors(prev => ({ ...prev, email: '이메일을 입력해 주세요.' }))
      return
    }
    const domain = isDomainDirect ? form.emailDomainCustom : form.emailDomain
    if (!domain) {
      setErrors(prev => ({ ...prev, email: '이메일 도메인을 선택해 주세요.' }))
      return
    }
    setEmailVerifyStep('sending')
    setErrors(prev => ({ ...prev, email: '' }))
    try {
      const email = getFullEmail()
      await api.post('/user/v1/reg/email-code', { email })
      setSentEmail(email)  // 발송한 이메일 고정 저장
      setEmailVerifyStep('code_sent')
      setModal({
        type: 'success',
        title: '인증코드 전송 완료',
        message: '이메일로 전송된 인증코드를 확인해 주세요.',
        onConfirm: () => setModal(null),
      })
    } catch (err) {
        setEmailVerifyStep('idle')
        setModal({
            type: 'error',
            message: err.response?.data?.message || '인증코드 전송에 실패했습니다.',
            onConfirm: () => setModal(null),
        })
    }
  }

  // 인증코드 확인
  const handleVerifyConfirm = async () => {
    if (!verifyCode || verifyCode.length !== 6) {
      setErrors(prev => ({ ...prev, verifyCode: '인증코드를 입력하세요.' }))
      return
    }
    setErrors(prev => ({ ...prev, verifyCode: '' }))
    try {
      await api.post('/user/v1/reg/verify-code', {
        email:      sentEmail,   // 발송 시 고정한 이메일 사용
        authNumber: verifyCode,  // code -> authNumber
      })
      setEmailVerifyStep('verified')
      setVerifyMessage('이메일 인증 완료')
      setVerifyMsgType('success')
      setModal({
        type: 'success',
        message: '이메일 인증에 성공했습니다.',
        onConfirm: () => setModal(null),
      })
    } catch (err) {
      setEmailVerifyStep('failed')
      setVerifyMsgType('error')
      setVerifyMessage('이메일 인증을 다시 시도하세요.')
      setModal({
        type: 'error',
        message: err.response?.data?.message || '인증에 실패했습니다. 코드를 확인해 주세요.',
        onConfirm: () => setModal(null),
      })
    }
  }

  // 카카오 주소 검색
  const handleAddrSearch = () => {
    const open = () => {
      new window.daum.Postcode({
        oncomplete: (data) => {
          setForm(prev => ({
            ...prev,
            addressBase: data.address,
            addressDetail: '',
          }))
        },
      }).open()
    }
    if (!window.daum) {
      const script = document.createElement('script')
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
      script.onload = open
      document.head.appendChild(script)
    } else {
      open()
    }
  }

  // 유효성 검사
  const validate = () => {
    const e = {}
    if (!RULES.loginId.test(form.loginId))
      e.loginId = '아이디를 입력해 주세요. (영문, 숫자 조합 4 ~ 20자)'
    if (!idChecked)
      e.loginId = e.loginId || '아이디 중복 확인을 해 주세요.'
    if (!RULES.password.test(form.password))
      e.password = '영문, 숫자, 특수문자 조합 8~16자'
    if (form.password !== form.passwordConfirm)
      e.passwordConfirm = '비밀번호가 일치하지 않습니다.'
    if (!RULES.name.test(form.name))
      e.name = '올바르지 않은 이름 입니다.'
    if (form.nickname && !RULES.nickname.test(form.nickname))
      e.nickname = '공백 및 특수문자 제외, 1~6자'
    if (!form.emailLocal)
      e.email = '이메일을 입력해 주세요.'
    if (emailVerifyStep !== 'verified')
      e.email = e.email || '이메일 인증을 수행하세요.'
    return e
  }

  // 다음 버튼
  const handleNext = () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    sessionStorage.setItem('signup-step1', JSON.stringify({
      loginId:         form.loginId,
      password:        form.password,
      passwordConfirm: form.passwordConfirm,
      name:            form.name,
      nickname:        form.nickname || null,
      email:           sentEmail,
      addr1:           form.addressBase,
      addr2:           form.addressDetail,
    }))
    navigate('/signup/step2')
  }

  // 이메일 버튼 텍스트
  const emailBtnText = () => {
    if (emailVerifyStep === 'sending') return '전송 중...'
    if (emailVerifyStep === 'failed')  return '재발송'
    return '이메일 인증'
  }

  return (
    <div className="su-page">

        <nav className="su-nav">
        <button className="su-nav-back" onClick={() => navigate('/login')}>‹</button>
        <span
            className="su-nav-logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
        >
            AlgoTalk
        </span>
        <div style={{ width: 40 }} />
        </nav>

      <div className="su-container">

        {/* 스텝 인디케이터 */}
        <div className="su-steps">
          <div className="su-step">
            <div className="su-step-circle active">1</div>
            <span className="su-step-label active">기본 정보</span>
          </div>
          <div className="su-step-line" />
          <div className="su-step">
            <div className="su-step-circle">2</div>
            <span className="su-step-label">목표 직무</span>
          </div>
          <div className="su-step-line" />
          <div className="su-step">
            <div className="su-step-circle">3</div>
            <span className="su-step-label">재직 이력</span>
          </div>
        </div>

        {/* 아이디 */}
        <div className="su-field">
          <label className="su-label">아이디 <span className="su-required">*</span></label>
          <div className="su-input-row">
            <input
              className={`su-input ${errors.loginId ? 'su-input--error' : idStatus === 'available' ? 'su-input--ok' : ''}`}
              type="text" name="loginId"
              placeholder="아이디를 입력해 주세요."
              value={form.loginId} onChange={handleChange}
            />
            <button className="su-side-btn" type="button" onClick={handleIdCheck}>중복 확인</button>
          </div>
          {errors.loginId
            ? <p className="su-hint su-hint--error">{errors.loginId}</p>
            : idStatus === 'available'
              ? <p className="su-hint su-hint--ok">사용 가능한 아이디 입니다.</p>
              : <p className="su-hint">영문, 숫자 조합 4 ~ 20자</p>
          }
        </div>

        {/* 비밀번호 */}
        <div className="su-field">
          <label className="su-label">비밀번호 <span className="su-required">*</span></label>
          <input
            className={`su-input ${errors.password ? 'su-input--error' : ''}`}
            type="password" name="password"
            placeholder="비밀번호를 입력해 주세요."
            value={form.password} onChange={handleChange}
          />
          {errors.password
            ? <p className="su-hint su-hint--error">{errors.password}</p>
            : <p className="su-hint">영문, 숫자, 특수문자 조합 8~16자</p>
          }
          <input
            className={`su-input ${errors.passwordConfirm ? 'su-input--error' : ''}`}
            type="password" name="passwordConfirm"
            placeholder="비밀번호를 다시 입력해 주세요."
            value={form.passwordConfirm} onChange={handleChange}
            style={{ marginTop: 8 }}
          />
          {errors.passwordConfirm && (
            <p className="su-hint su-hint--error">{errors.passwordConfirm}</p>
          )}
        </div>

        {/* 이름 */}
        <div className="su-field">
          <label className="su-label">이름 <span className="su-required">*</span></label>
          <input
            className={`su-input ${errors.name ? 'su-input--error' : ''}`}
            type="text" name="name"
            placeholder="이름을 입력해 주세요."
            value={form.name} onChange={handleChange}
          />
          {errors.name
            ? <p className="su-hint su-hint--error">{errors.name}</p>
            : <p className="su-hint">실명으로 입력해주세요.</p>
          }
        </div>

        {/* 닉네임 */}
        <div className="su-field">
          <label className="su-label">닉네임</label>
          <div className="su-input-row">
            <input
              className={`su-input ${errors.nickname ? 'su-input--error' : nicknameStatus === 'available' ? 'su-input--ok' : ''}`}
              type="text" name="nickname"
              placeholder="닉네임을 입력해 주세요."
              value={form.nickname} onChange={handleChange}
            />
            <button className="su-side-btn" type="button" onClick={handleNicknameCheck}>
              중복 확인
            </button>
          </div>
          {errors.nickname
            ? <p className="su-hint su-hint--error">{errors.nickname}</p>
            : nicknameStatus === 'available'
              ? <p className="su-hint su-hint--ok">사용 가능한 닉네임 입니다.</p>
              : <p className="su-hint">공백 및 특수문자 제외, 1~6자</p>
          }
        </div>

        {/* 이메일 */}
        <div className="su-field">
          <label className="su-label">이메일 <span className="su-required">*</span></label>
          <div className="su-email-row">
            <input
              className={`su-input su-email-local ${errors.email ? 'su-input--error' : ''}`}
              type="text" name="emailLocal"
              placeholder="이메일을 입력해 주세요."
              value={form.emailLocal} onChange={handleChange}
              disabled={emailVerifyStep === 'verified'}
            />
            <span className="su-at">@</span>
            {isDomainDirect && (
              <input
                className="su-input su-email-domain-input"
                type="text" name="emailDomainCustom"
                value={form.emailDomainCustom} onChange={handleChange}
                disabled={emailVerifyStep === 'verified'}
              />
            )}
            <div className="su-select-wrap">
              <select
                className="su-select"
                value={form.emailDomain}
                onChange={handleDomainChange}
                disabled={emailVerifyStep === 'verified'}
              >
                <option value="">선택해 주세요.</option>
                {EMAIL_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <button
              className="su-side-btn"
              type="button"
              onClick={handleEmailVerify}
              disabled={
                emailVerifyStep === 'sending' ||
                emailVerifyStep === 'verifying' ||
                emailVerifyStep === 'verified'
              }
            >
              {emailBtnText()}
            </button>
          </div>
          {errors.email && (
            <p className="su-hint su-hint--error">{errors.email}</p>
          )}

          {/* 인증코드 입력 */}
          {['code_sent', 'verifying', 'verified', 'failed'].includes(emailVerifyStep) && (
            <>
              {verifyMessage && (
                <p className={`su-hint ${verifyMsgType === 'success' ? 'su-hint--ok' : 'su-hint--error'}`}>
                  {verifyMessage}
                </p>
              )}
              <div className="su-input-row" style={{ marginTop: 8 }}>
                <input
                  className={`su-input ${errors.verifyCode ? 'su-input--error' : ''}`}
                  type="text"
                  placeholder="인증코드 6자리를 입력해 주세요."
                  value={verifyCode}
                  onChange={e => {
                    setVerifyCode(e.target.value)
                    setErrors(prev => ({ ...prev, verifyCode: '' }))
                  }}
                  disabled={emailVerifyStep === 'verified'}
                  maxLength={6}
                />
                <button
                  className="su-side-btn"
                  type="button"
                  onClick={handleVerifyConfirm}
                  disabled={emailVerifyStep === 'verified'}
                >
                  인증하기
                </button>
              </div>
              {errors.verifyCode && (
                <p className="su-hint su-hint--error">{errors.verifyCode}</p>
              )}
            </>
          )}
        </div>

        {/* 주소 */}
        <div className="su-field">
          <label className="su-label">주소</label>
          <div className="su-input-row">
            <input
              className="su-input"
              type="text"
              placeholder="기본 주소"
              value={form.addressBase}
              readOnly
            />
            <button className="su-side-btn" type="button" onClick={handleAddrSearch}>
              주소 검색
            </button>
          </div>
          <input
            className="su-input" style={{ marginTop: 6 }}
            type="text" name="addressDetail"
            placeholder="상세 주소"
            value={form.addressDetail} onChange={handleChange}
          />
        </div>

        {/* 다음 버튼 */}
        <button className="su-next-btn" type="button" onClick={handleNext}>
          다 음
        </button>

      </div>

      {modal && (<AlertModal type={modal.type} title={modal.title} message={modal.message} onConfirm={modal.onConfirm} onClose={modal.onConfirm} align="left" />)}
    </div>
  )
}