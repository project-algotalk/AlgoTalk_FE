// src/pages/mypage/MyPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Navbar from '../../components/common/Navbar'
import { useLocation } from 'react-router-dom'
import {
    fetchMyPageInfo,
    updateLoginId, updatePassword, setPassword,
    updateNickname, updateName, updateAddr,
    sendEmailCode, verifyEmailCode, updateEmail,
    issueLinkToken, unlinkSocial, withdraw,
} from '../../api/myPageApi'
import './MyPage.css'

// ── 공통 성공/에러 모달
function SuccessModal({ message, onConfirm, type = 'success' }) {
    const isError = type === 'error'
    const color = isError ? '#d32f2f' : '#1a7f4b'

    return (
        <div className="mp-modal-overlay">
            <div className="mp-modal" style={{ textAlign: 'center', padding: '36px' }}>
                <div style={{ marginBottom: 16 }}>
                    {isError ? (
                        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                            <circle cx="26" cy="26" r="24" stroke={color} strokeWidth="2.5" fill="none"/>
                            <path d="M18 18l16 16M34 18l-16 16" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                    ) : (
                        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                            <circle cx="26" cy="26" r="24" stroke={color} strokeWidth="2.5" fill="none"/>
                            <path d="M15 26l8 8 14-14" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    )}
                </div>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: '#1a1a1a', marginBottom: 24 }}>
                    {message}
                </p>
                <button className="mp-modal-btn primary" style={{ width: '100%', height: 44 }} onClick={onConfirm}>
                    확인
                </button>
            </div>
        </div>
    )
}

// 공통 에러 메시지 파싱
const parseError = (err, fallback = '처리에 실패했습니다.') => {
    const data = err.response?.data
    if (!data) return fallback
    if (data.fieldErrors?.length > 0) return data.fieldErrors[0].reason
    return data.message || fallback
}

// ── 아이디 변경 모달
function LoginIdModal({ current, onClose, onSuccess }) {
    const [loginId, setLoginId] = useState(current || '')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const RULE = /^[a-zA-Z0-9]{4,20}$/

    if (done) return (
        <SuccessModal message="아이디가 변경되었습니다." onConfirm={() => onSuccess(loginId)} />
    )

    const handleSubmit = async () => {
        if (!RULE.test(loginId)) { setError('영문, 숫자 조합 4~20자로 입력해주세요.'); return }
        setLoading(true)
        try {
            await updateLoginId({ loginId })
            setDone(true)
        } catch (err) {
            setError(parseError(err, '아이디 변경에 실패했습니다.'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mp-modal-overlay" onClick={onClose}>
            <div className="mp-modal" onClick={e => e.stopPropagation()}>
                <h2 className="mp-modal-title">아이디 변경</h2>
                <div className="mp-modal-field">
                    <label className="mp-modal-label">새 아이디 <span className="mp-modal-required">*</span></label>
                    <input
                        className={`mp-modal-input ${error ? 'error' : ''}`}
                        type="text" placeholder="새 아이디를 입력해주세요."
                        value={loginId}
                        onChange={e => { setLoginId(e.target.value); setError('') }}
                    />
                    {error ? <p className="mp-hint error">{error}</p> : <p className="mp-hint">영문, 숫자 조합 4~20자</p>}
                </div>
                <div className="mp-modal-btn-row">
                    <button className="mp-modal-btn" onClick={onClose}>취소</button>
                    <button className="mp-modal-btn primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? '처리 중...' : '변경하기'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── 비밀번호 변경 모달
function PasswordModal({ passwordSetYn, onClose, onSuccess }) {
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', newPasswordConfirm: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const isSet = passwordSetYn === 'N'

    if (done) return (
        <SuccessModal
            message={isSet ? '비밀번호가 설정되었습니다.' : '비밀번호가 변경되었습니다.'}
            onConfirm={onSuccess}
        />
    )

    const handleChange = (e) => {
        setForm(p => ({ ...p, [e.target.name]: e.target.value }))
        setErrors(p => ({ ...p, [e.target.name]: '' }))
    }

    const handleSubmit = async () => {
        const e = {}
        if (!isSet && !form.currentPassword) e.currentPassword = '현재 비밀번호를 입력해주세요.'
        if (!form.newPassword) e.newPassword = '새 비밀번호를 입력해주세요.'
        if (form.newPassword !== form.newPasswordConfirm) e.newPasswordConfirm = '비밀번호가 일치하지 않습니다.'
        if (Object.keys(e).length > 0) { setErrors(e); return }
        setLoading(true)
        try {
            if (isSet) {
                await setPassword({ newPassword: form.newPassword, newPasswordConfirm: form.newPasswordConfirm })
            } else {
                await updatePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword, newPasswordConfirm: form.newPasswordConfirm })
            }
            setDone(true)
            } catch (err) {
                setErrors({ currentPassword: parseError(err, '비밀번호 변경에 실패했습니다.') })
            } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mp-modal-overlay" onClick={onClose}>
            <div className="mp-modal" onClick={e => e.stopPropagation()}>
                <h2 className="mp-modal-title">{isSet ? '비밀번호 설정' : '비밀번호 변경'}</h2>
                {!isSet && (
                    <div className="mp-modal-field">
                        <label className="mp-modal-label">현재 비밀번호 <span className="mp-modal-required">*</span></label>
                        <input className={`mp-modal-input ${errors.currentPassword ? 'error' : ''}`}
                            type="password" name="currentPassword"
                            placeholder="현재 비밀번호를 입력해주세요."
                            value={form.currentPassword} onChange={handleChange} />
                        {errors.currentPassword && <p className="mp-hint error">{errors.currentPassword}</p>}
                    </div>
                )}
                <div className="mp-modal-field">
                    <label className="mp-modal-label">새 비밀번호 <span className="mp-modal-required">*</span></label>
                    <input className={`mp-modal-input ${errors.newPassword ? 'error' : ''}`}
                        type="password" name="newPassword"
                        placeholder="새 비밀번호를 입력해주세요."
                        value={form.newPassword} onChange={handleChange} />
                    {errors.newPassword ? <p className="mp-hint error">{errors.newPassword}</p> : <p className="mp-hint">영문, 숫자, 특수문자 조합 8자 이상</p>}
                </div>
                <div className="mp-modal-field">
                    <label className="mp-modal-label">새 비밀번호 확인 <span className="mp-modal-required">*</span></label>
                    <input className={`mp-modal-input ${errors.newPasswordConfirm ? 'error' : ''}`}
                        type="password" name="newPasswordConfirm"
                        placeholder="새 비밀번호를 다시 입력해주세요."
                        value={form.newPasswordConfirm} onChange={handleChange} />
                    {errors.newPasswordConfirm && <p className="mp-hint error">{errors.newPasswordConfirm}</p>}
                </div>
                <div className="mp-modal-btn-row">
                    <button className="mp-modal-btn" onClick={onClose}>취소</button>
                    <button className="mp-modal-btn primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? '처리 중...' : isSet ? '설정하기' : '변경하기'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── 닉네임 변경 모달
function NicknameModal({ current, onClose, onSuccess }) {
    const [nickname, setNickname] = useState(current || '')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    if (done) return (
        <SuccessModal message="닉네임이 변경되었습니다." onConfirm={() => onSuccess(nickname)} />
    )

    const handleSubmit = async () => {
        if (!nickname.trim()) { setError('닉네임을 입력해주세요.'); return }
        setLoading(true)
        try {
            await updateNickname({ nickname: nickname.trim() })
            setDone(true)
        } catch (err) {
            setError(parseError(err, '닉네임 변경에 실패했습니다.'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mp-modal-overlay" onClick={onClose}>
            <div className="mp-modal" onClick={e => e.stopPropagation()}>
                <h2 className="mp-modal-title">닉네임 변경</h2>
                <div className="mp-modal-field">
                    <label className="mp-modal-label">닉네임 <span className="mp-modal-required">*</span></label>
                    <input className={`mp-modal-input ${error ? 'error' : ''}`}
                        type="text" placeholder="새 닉네임을 입력해주세요."
                        value={nickname} onChange={e => { setNickname(e.target.value); setError('') }} />
                    {error && <p className="mp-hint error">{error}</p>}
                </div>
                <div className="mp-modal-btn-row">
                    <button className="mp-modal-btn" onClick={onClose}>취소</button>
                    <button className="mp-modal-btn primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? '처리 중...' : '변경하기'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── 이름 변경 모달
function NameModal({ current, onClose, onSuccess }) {
    const [name, setName] = useState(current || '')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    if (done) return (
        <SuccessModal message="이름이 변경되었습니다." onConfirm={() => onSuccess(name)} />
    )

    const handleSubmit = async () => {
        if (!name.trim()) { setError('이름을 입력해주세요.'); return }
        setLoading(true)
        try {
            await updateName({ name: name.trim() })
            setDone(true)
        } catch (err) {
            setError(parseError(err, '이름 변경에 실패했습니다.'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mp-modal-overlay" onClick={onClose}>
            <div className="mp-modal" onClick={e => e.stopPropagation()}>
                <h2 className="mp-modal-title">이름 변경</h2>
                <div className="mp-modal-field">
                    <label className="mp-modal-label">이름 <span className="mp-modal-required">*</span></label>
                    <input className={`mp-modal-input ${error ? 'error' : ''}`}
                        type="text" placeholder="이름을 입력해주세요."
                        value={name} onChange={e => { setName(e.target.value); setError('') }} />
                    {error && <p className="mp-hint error">{error}</p>}
                </div>
                <div className="mp-modal-btn-row">
                    <button className="mp-modal-btn" onClick={onClose}>취소</button>
                    <button className="mp-modal-btn primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? '처리 중...' : '변경하기'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── 이메일 변경 모달
function EmailModal({ onClose, onSuccess }) {
    const [emailLocal, setEmailLocal] = useState('')
    const [emailDomain, setEmailDomain] = useState('')
    const [verifyStep, setVerifyStep] = useState('idle')
    const [code, setCode] = useState('')
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const EMAIL_DOMAINS = ['naver.com', 'gmail.com', 'daum.net', 'kakao.com', 'outlook.com']
    const fullEmail = `${emailLocal}@${emailDomain}`

    if (done) return (
        <SuccessModal message="이메일이 변경되었습니다." onConfirm={() => onSuccess(fullEmail)} />
    )

    const handleSendCode = async () => {
        if (!emailLocal || !emailDomain) { setErrors({ email: '이메일을 입력해주세요.' }); return }
        setVerifyStep('sending')
        try {
            await sendEmailCode({ email: fullEmail })
            setVerifyStep('sent')
        } catch (err) {
            setErrors({ email: parseError(err, '인증코드 발송에 실패했습니다.') })
            setVerifyStep('idle')
        }
    }

    const handleVerify = async () => {
        if (!code) { setErrors({ code: '인증코드를 입력해주세요.' }); return }
        try {
            await verifyEmailCode({ email: fullEmail, authNumber: code })
            setVerifyStep('verified')
        } catch (err) {
            setErrors({ code: parseError(err, '인증에 실패했습니다.') })
        }
    }

    const handleSubmit = async () => {
        if (verifyStep !== 'verified') { setErrors({ email: '이메일 인증을 완료해주세요.' }); return }
        setLoading(true)
        try {
            await updateEmail({ email: fullEmail })
            setDone(true)
        } catch (err) {
            setErrors({ email: parseError(err, '이메일 변경에 실패했습니다.') })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mp-modal-overlay" onClick={onClose}>
            <div className="mp-modal" onClick={e => e.stopPropagation()}>
                <h2 className="mp-modal-title">이메일 변경</h2>
                <div className="mp-modal-field">
                    <label className="mp-modal-label">새 이메일 <span className="mp-modal-required">*</span></label>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                        <input className={`mp-modal-input ${errors.email ? 'error' : ''}`} style={{ flex: 1 }}
                            type="text" placeholder="이메일"
                            value={emailLocal} onChange={e => { setEmailLocal(e.target.value); setErrors({}) }}
                            disabled={verifyStep === 'verified'} />
                        <span style={{ lineHeight: '44px', color: '#888' }}>@</span>
                        <select style={{ height: 44, padding: '0 8px', border: '1px solid #d0d0d0', borderRadius: 6, fontSize: '0.875rem', background: '#fff' }}
                            value={emailDomain} onChange={e => { setEmailDomain(e.target.value); setErrors({}) }}
                            disabled={verifyStep === 'verified'}>
                            <option value="">선택</option>
                            {EMAIL_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <button className="mp-row-btn" onClick={handleSendCode}
                        disabled={verifyStep === 'sending' || verifyStep === 'verified'}
                        style={{ width: '100%', height: 36 }}>
                        {verifyStep === 'sending' ? '전송 중...' : verifyStep === 'sent' ? '재발송' : '인증코드 발송'}
                    </button>
                    {errors.email && <p className="mp-hint error">{errors.email}</p>}
                </div>
                {['sent', 'verified'].includes(verifyStep) && (
                    <div className="mp-modal-field">
                        <label className="mp-modal-label">인증코드</label>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <input className={`mp-modal-input ${errors.code ? 'error' : ''}`} style={{ flex: 1 }}
                                type="text" placeholder="6자리 코드"
                                value={code} maxLength={6}
                                onChange={e => { setCode(e.target.value); setErrors({}) }}
                                disabled={verifyStep === 'verified'} />
                            <button className="mp-row-btn" onClick={handleVerify}
                                disabled={verifyStep === 'verified'} style={{ height: 44 }}>
                                인증하기
                            </button>
                        </div>
                        {verifyStep === 'verified'
                            ? <p className="mp-hint ok">인증 완료</p>
                            : errors.code && <p className="mp-hint error">{errors.code}</p>}
                    </div>
                )}
                <div className="mp-modal-btn-row">
                    <button className="mp-modal-btn" onClick={onClose}>취소</button>
                    <button className="mp-modal-btn primary" onClick={handleSubmit}
                        disabled={loading || verifyStep !== 'verified'}>
                        {loading ? '처리 중...' : '변경하기'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── 주소 변경 모달
function AddrModal({ current1, current2, onClose, onSuccess }) {
    const [addr1, setAddr1] = useState(current1 || '')
    const [addr2, setAddr2] = useState(current2 || '')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    if (done) return (
        <SuccessModal message="주소가 변경되었습니다." onConfirm={() => onSuccess(addr1, addr2)} />
    )

    const handleAddrSearch = () => {
        const open = () => new window.daum.Postcode({ oncomplete: (data) => setAddr1(data.address) }).open()
        if (!window.daum) {
            const script = document.createElement('script')
            script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
            script.onload = open
            document.head.appendChild(script)
        } else { open() }
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            await updateAddr({ addr1, addr2 })
            setDone(true)
        } catch {
            alert('주소 변경에 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mp-modal-overlay" onClick={onClose}>
            <div className="mp-modal" onClick={e => e.stopPropagation()}>
                <h2 className="mp-modal-title">주소 변경</h2>
                <div className="mp-modal-field">
                    <label className="mp-modal-label">기본 주소</label>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                        <input className="mp-modal-input" style={{ flex: 1 }} type="text"
                            value={addr1} readOnly placeholder="주소 검색을 이용해주세요." />
                        <button className="mp-row-btn" onClick={handleAddrSearch} style={{ height: 44 }}>주소 검색</button>
                    </div>
                    <input className="mp-modal-input" type="text" placeholder="상세 주소"
                        value={addr2} onChange={e => setAddr2(e.target.value)} />
                </div>
                <div className="mp-modal-btn-row">
                    <button className="mp-modal-btn" onClick={onClose}>취소</button>
                    <button className="mp-modal-btn primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? '처리 중...' : '변경하기'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── 소셜 연결 해제 확인 모달
function UnlinkModal({ provider, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false)
    const PROVIDER_NAMES = { GOOGLE: '구글', KAKAO: '카카오', NAVER: '네이버' }

    const handleUnlink = async () => {
        setLoading(true)
        try {
            await unlinkSocial(provider)
            onSuccess(provider)
        } catch (err) {
            alert(err.response?.data?.message || '연결 해제에 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mp-modal-overlay" onClick={onClose}>
            <div className="mp-modal" onClick={e => e.stopPropagation()}>
                <h2 className="mp-modal-title">SNS 연결 해제</h2>
                <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: 20 }}>
                    {PROVIDER_NAMES[provider]} 계정 연결을 해제하시겠습니까?
                </p>
                <div className="mp-modal-btn-row">
                    <button className="mp-modal-btn" onClick={onClose}>취소</button>
                    <button className="mp-modal-btn danger" onClick={handleUnlink} disabled={loading}>
                        {loading ? '처리 중...' : '연결 해제'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── 회원 탈퇴 모달 (2단계)
function WithdrawModal({ passwordSetYn, onClose }) {
    const [step, setStep] = useState(1)
    const [agreed1, setAgreed1] = useState(false)
    const [agreed2, setAgreed2] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const { logout } = useAuthStore()
    const navigate = useNavigate()

    const skipPasswordCheck = passwordSetYn === 'N'

    // done이 true일 때만 타이머 실행
    useEffect(() => {
        if (!done) return
        const timer = setTimeout(() => {
            sessionStorage.setItem('logged-out', 'true')
            logout()
            navigate('/', { replace: true })
        }, 3000)
        return () => clearTimeout(timer)
    }, [done, logout, navigate])

    const handleWithdraw = async () => {
        if (!skipPasswordCheck && !currentPassword) {
            setError('현재 비밀번호를 입력해주세요.')
            return
        }
        setLoading(true)
        setError('')
        try {
            await withdraw(!skipPasswordCheck ? { currentPassword } : null)
            setDone(true)  // 성공 시에만 done = true
        } catch (err) {
            setError(parseError(err, '탈퇴 처리에 실패했습니다.'))
        } finally {
            setLoading(false)
        }
    }

    if (done) {
        return (
            <div className="mp-modal-overlay">
                <div className="mp-modal" style={{ textAlign: 'center', padding: '48px 36px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 20 }}>👋</div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
                        탈퇴 완료되었습니다
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.7 }}>
                        그동안 AlgoTalk을 이용해주셔서 감사합니다.<br />
                        3초 후 메인 화면으로 이동합니다.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="mp-modal-overlay" onClick={onClose}>
            <div className="mp-modal" onClick={e => e.stopPropagation()}>
                <h2 className="mp-modal-title">회원 탈퇴</h2>

                {step === 1 ? (
                    <>
                        <div className="mp-withdraw-warn">
                            <p className="mp-withdraw-warn-title">탈퇴 시 아래 데이터는 모두 삭제됩니다.</p>
                            <ul>
                                <li>면접 세션 기록 및 분석 결과</li>
                                <li>작성 글, 댓글, 스크랩 목록</li>
                                <li>프로필 정보</li>
                            </ul>
                        </div>
                        <label className="mp-withdraw-check-label">
                            <input type="checkbox" checked={agreed1} onChange={e => setAgreed1(e.target.checked)} />
                            위의 안내 사항에 동의합니다.
                        </label>
                        <label className="mp-withdraw-check-label">
                            <input type="checkbox" checked={agreed2} onChange={e => setAgreed2(e.target.checked)} />
                            탈퇴 후 동일 이메일로 가입 가능하나, 기존 데이터는 연결되지 않습니다.
                        </label>
                        <div className="mp-modal-btn-row">
                            <button className="mp-modal-btn" onClick={onClose}>취소</button>
                            <button
                                className="mp-modal-btn danger"
                                onClick={() => setStep(2)}
                                disabled={!agreed1 || !agreed2}
                            >
                                다음
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {!skipPasswordCheck && (
                            <div className="mp-modal-field">
                                <label className="mp-modal-label">
                                    현재 비밀번호 확인 <span className="mp-modal-required">*</span>
                                </label>
                                <input
                                    className={`mp-modal-input ${error ? 'error' : ''}`}
                                    type="password"
                                    // 에러가 있으면 placeholder에 에러 메시지 표시
                                    placeholder={error || '현재 비밀번호를 입력해주세요.'}
                                    value={currentPassword}
                                    onChange={e => {
                                        setCurrentPassword(e.target.value)
                                        setError('')
                                    }}
                                />
                                {/* input 아래에도 에러 텍스트 표시 */}
                                {error && <p className="mp-hint error">{error}</p>}
                            </div>
                        )}
                        <div className="mp-modal-btn-row">
                            <button className="mp-modal-btn" onClick={() => { setStep(1); setError('') }}>이전</button>
                            <button className="mp-modal-btn" onClick={onClose}>취소</button>
                            <button className="mp-modal-btn danger" onClick={handleWithdraw} disabled={loading}>
                                {loading ? '처리 중...' : '탈퇴하기'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

// ── 메인 마이페이지
export default function MyPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, login } = useAuthStore()
    const [tab, setTab] = useState('account')
    const [info, setInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(null) // 'password' | 'nickname' | 'name' | 'email' | 'addr' | 'unlink' | 'withdraw'
    const [unlinkProvider, setUnlinkProvider] = useState(null)
    const getSocialLinkErrorMessage = (errorCode) => {
        const messageByCode = {
            USER_058: '이미 내 계정에 연결된 소셜 계정입니다.',
            USER_059: '다른 계정에 이미 연결된 소셜 계정입니다.',
            USER_061: '소셜 계정 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.',
        }

        return messageByCode[errorCode] || '소셜 계정 연결에 실패했습니다.'
    }
    
    const [resultModal, setResultModal] = useState(() => {
        if (location.state?.linkSuccess) return { type: 'success', message: '소셜 계정이 연결되었습니다.' }
        if (location.state?.linkError) {
            return { type: 'error', message: getSocialLinkErrorMessage(location.state?.linkErrorCode) }
        }        return null
    }) // { type: 'success'|'error', message }


    useEffect(() => {
        if (location.state?.linkSuccess) {
            fetchMyPageInfo().then(data => setInfo(data)).catch(() => {})
        }
        if (location.state?.linkSuccess || location.state?.linkError) {
            navigate(location.pathname, { replace: true, state: {} })
        }
    }, [location.pathname, location.state, navigate])

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchMyPageInfo()
                setInfo(data)
            } catch {
                alert('정보를 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const maskEmail = (email) => {
        if (!email) return ''
        const [local, domain] = email.split('@')
        return local.slice(0, 2) + '*'.repeat(Math.max(local.length - 2, 4)) + '@' + domain
    }

    const maskName = (name) => {
        if (!name || name.length < 2) return name
        return name[0] + '*'.repeat(name.length - 1)
    }

    const PROVIDERS = ['GOOGLE', 'KAKAO', 'NAVER']
    const PROVIDER_LABELS = { GOOGLE: 'G', KAKAO: '💬', NAVER: 'N' }
    const PROVIDER_CLASSES = { GOOGLE: 'google', KAKAO: 'kakao', NAVER: 'naver' }

    const isLinked = (provider) => info?.socialProviders?.includes(provider)

    const handleUnlinkSuccess = (provider) => {
        setInfo(p => ({ ...p, socialProviders: p.socialProviders.filter(sp => sp !== provider) }))
        setModal(null)
    }

    if (loading) return (
        <div className="mp-page">
            <Navbar />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#aaa' }}>
                로딩 중...
            </div>
        </div>
    )

    return (
        <div className="mp-page">
            <Navbar />

            <div className="mp-layout">
                {/* 사이드바 */}
                <aside className="mp-sidebar">
                    <div className="mp-sidebar-section">
                        <p className="mp-sidebar-title">계정 설정</p>
                        <button className={`mp-sidebar-item ${tab === 'account' ? 'active' : ''}`} onClick={() => setTab('account')}>로그인 정보</button>
                        <button className={`mp-sidebar-item ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>회원 정보</button>
                        <button className={`mp-sidebar-item ${tab === 'targetJob' ? 'active' : ''}`} onClick={() => setTab('targetJob')}>목표 직무</button>
                        <button className={`mp-sidebar-item ${tab === 'employment' ? 'active' : ''}`} onClick={() => setTab('employment')}>재직 이력</button>
                    </div>
                    <div className="mp-sidebar-section">
                        <button className="mp-sidebar-item danger" onClick={() => setModal('withdraw')}>회원 탈퇴</button>
                    </div>
                </aside>

                {/* 콘텐츠 */}
                <main className="mp-content">
                    {/* 프로필 헤더 */}
                    <div className="mp-profile-header">
                        <div className="mp-avatar">
                            👤
                            <div className="mp-avatar-edit">✎</div>
                        </div>
                        <div>
                            <div className="mp-profile-name">{info?.nickname || user?.nickname}</div>
                            <div className="mp-profile-joined">
                                {info?.createdAt ? new Date(info.createdAt).toLocaleDateString('ko-KR') + ' 가입' : ''}
                            </div>
                        </div>
                    </div>

                    {/* 탭 */}
                    <div className="mp-tabs">
                        <button className={`mp-tab ${tab === 'account' || tab === 'profile' || tab === 'targetJob' || tab === 'employment' ? (tab === 'account' || tab === 'profile' ? 'active' : '') : ''}`}
                            onClick={() => setTab('account')}>
                            계정 설정
                        </button>
                        <button className={`mp-tab ${tab === 'activity' ? 'active' : ''}`} onClick={() => setTab('activity')}>
                            내 활동
                        </button>
                    </div>

                    {/* 로그인 정보 */}
                    {tab === 'account' && (
                        <>
                            <div className="mp-card">
                                <h3 className="mp-card-title">로그인 정보</h3>
                                <div className="mp-row">
                                    <span className="mp-row-label">아이디</span>
                                    <span className="mp-row-value">{info?.loginId || '-'}</span>
                                    <button className="mp-row-btn" onClick={() => setModal('loginId')}>
                                        아이디 변경
                                    </button>
                                </div>

                                <div className="mp-row">
                                    <span className="mp-row-label">비밀번호</span>
                                    <span className="mp-row-value">
                                        <span className="mp-pw-dots">{'•'.repeat(10)}</span>
                                    </span>
                                    <button className="mp-row-btn" onClick={() => setModal('password')}>
                                        {info?.passwordSetYn === 'N' ? '비밀번호 설정' : '비밀번호 변경'}
                                    </button>
                                </div>

                                <div className="mp-sns-row">
                                    <span className="mp-sns-label">SNS 계정 연결</span>
                                    <div className="mp-sns-icons">
                                        {PROVIDERS.map(provider => (
                                            <button
                                                key={provider}
                                                className={`mp-sns-icon ${PROVIDER_CLASSES[provider]} ${!isLinked(provider) ? 'inactive' : ''}`}
                                                onClick={async () => {
                                                    if (isLinked(provider)) {
                                                        // 연결 해제
                                                        setUnlinkProvider(provider)
                                                        setModal('unlink')
                                                    } else {
                                                        try {
                                                            const linkToken = await issueLinkToken(provider)
                                                            sessionStorage.setItem('oauth2_link_mode', 'true')
                                                            window.location.href =
                                                                `${import.meta.env.VITE_API_URL}/oauth2/authorization/${provider.toLowerCase()}?linkToken=${linkToken}`
                                                        } catch (err) {
                                                            alert(err.response?.data?.message || '소셜 연결 요청에 실패했습니다.')
                                                        }
                                                    }
                                                }}
                                                title={isLinked(provider) ? `${provider} 연결 해제` : `${provider} 연결하기`}
                                            >
                                                {PROVIDER_LABELS[provider]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* 회원 정보 */}
                    {tab === 'profile' && (
                        <div className="mp-card">
                            <h3 className="mp-card-title">회원 정보</h3>

                            <div className="mp-row">
                                <span className="mp-row-label">이름</span>
                                <span className="mp-row-value">{maskName(info?.name)}</span>
                                <button className="mp-row-btn" onClick={() => setModal('name')}>이름 변경</button>
                            </div>

                            <div className="mp-row">
                                <span className="mp-row-label">닉네임</span>
                                <span className="mp-row-value">{info?.nickname}</span>
                                <button className="mp-row-btn" onClick={() => setModal('nickname')}>닉네임 변경</button>
                            </div>

                            <div className="mp-row">
                                <span className="mp-row-label">이메일</span>
                                <span className="mp-row-value">{maskEmail(info?.email)}</span>
                                <button className="mp-row-btn" onClick={() => setModal('email')}>이메일 변경</button>
                            </div>

                            <div className="mp-row">
                                <span className="mp-row-label">주소</span>
                                <div className="mp-row-value" style={{ fontSize: '0.875rem', color: '#555' }}>
                                    {info?.addr1 ? <>{info.addr1}<br />{info.addr2}</> : '-'}
                                </div>
                                <button className="mp-row-btn" onClick={() => setModal('addr')}>주소 검색</button>
                            </div>
                        </div>
                    )}

                    {/* 목표 직무 */}
                    {tab === 'targetJob' && (
                        <div className="mp-card">
                            <h3 className="mp-card-title">목표 직무</h3>
                            {info?.targetJobs?.length > 0 ? (
                                info.targetJobs.map((job, i) => (
                                    <div key={i} className="mp-row">
                                        <span className="mp-row-value">{job.categoryName}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#aaa' }}>
                                            {job.startDate} ~ {job.endDate || '준비중'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#aaa', fontSize: '0.875rem' }}>등록된 목표 직무가 없습니다.</p>
                            )}
                        </div>
                    )}

                    {/* 재직 이력 */}
                    {tab === 'employment' && (
                        <div className="mp-card">
                            <h3 className="mp-card-title">재직 이력</h3>
                            {info?.employments?.length > 0 ? (
                                info.employments.map((emp, i) => (
                                    <div key={i} className="mp-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                                        <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{emp.companyName}</span>
                                        <span style={{ fontSize: '0.85rem', color: '#666' }}>{emp.categoryName}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#aaa' }}>
                                            {emp.startDate} ~ {emp.endDate || '재직중'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#aaa', fontSize: '0.875rem' }}>등록된 재직 이력이 없습니다.</p>
                            )}
                        </div>
                    )}

                    {/* 내 활동 */}
                    {tab === 'activity' && (
                        <div className="mp-card">
                            <h3 className="mp-card-title">내 활동</h3>
                            <p style={{ color: '#aaa', fontSize: '0.875rem' }}>준비 중입니다.</p>
                        </div>
                    )}
                </main>
            </div>

            {/* 모달들 */}
            {modal === 'loginId' && (
                <LoginIdModal
                    current={info?.loginId}
                    onClose={() => setModal(null)}
                    onSuccess={(loginId) => {
                        setInfo(p => ({ ...p, loginId }))
                        setModal(null)
                    }}
                />
            )}

            {resultModal && (
                <SuccessModal
                    type={resultModal.type}
                    message={resultModal.message}
                    onConfirm={() => setResultModal(null)}
                />
            )}

            {modal === 'unlink' && unlinkProvider && (
                <UnlinkModal
                    provider={unlinkProvider}
                    onClose={() => setModal(null)}
                    onSuccess={handleUnlinkSuccess}
                />
            )}

            {modal === 'password' && (
                <PasswordModal
                    passwordSetYn={info?.passwordSetYn}
                    onClose={() => setModal(null)}
                    onSuccess={() => setModal(null)}  // alert 제거
                />
            )}

            {modal === 'nickname' && (
                <NicknameModal
                    current={info?.nickname}
                    onClose={() => setModal(null)}
                    onSuccess={(nickname) => {
                        setInfo(p => ({ ...p, nickname }))
                        login({ user: { ...user, nickname } })
                        setModal(null)
                    }}
                />
            )}

            {modal === 'name' && (
                <NameModal
                    current={info?.name}
                    onClose={() => setModal(null)}
                    onSuccess={(name) => { setInfo(p => ({ ...p, name })); setModal(null) }}
                />
            )}

            {modal === 'email' && (
                <EmailModal
                    onClose={() => setModal(null)}
                    onSuccess={(email) => { setInfo(p => ({ ...p, email })); setModal(null) }}
                />
            )}

            {modal === 'addr' && (
                <AddrModal
                    current1={info?.addr1}
                    current2={info?.addr2}
                    onClose={() => setModal(null)}
                    onSuccess={(addr1, addr2) => { setInfo(p => ({ ...p, addr1, addr2 })); setModal(null) }}
                />
            )}

            {modal === 'unlink' && unlinkProvider && (
                <UnlinkModal
                    provider={unlinkProvider}
                    onClose={() => setModal(null)}
                    onSuccess={handleUnlinkSuccess}
                />
            )}

            {modal === 'withdraw' && (
                <WithdrawModal
                    passwordSetYn={info?.passwordSetYn}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    )
}