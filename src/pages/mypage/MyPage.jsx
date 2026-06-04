// src/pages/mypage/MyPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Navbar from '../../components/common/Navbar'
import AlertModal from '../../components/common/AlertModal'
import BaseModal from '../../components/common/BaseModal'
import JobCategoryModal from '../../components/common/JobCategoryModal'
import { useLocation } from 'react-router-dom'
import { fetchCategories } from '../../api/csCategoryApi'
import {
    fetchMyPageInfo,
    updateLoginId, updatePassword, setPassword,
    updateNickname, updateName, updateAddr,
    sendEmailCode, verifyEmailCode, updateEmail,
    issueLinkToken, unlinkSocial,
    updateTargetJobs, updateEmployments,
    withdraw,
    fetchMyPosts, deleteMyPosts,
    fetchMyComments, deleteMyComments,
    fetchMyScraps, deleteMyScraps,
    fetchMyLikes, deleteMyLikes,
} from '../../api/myPageApi'
import { Heart, Bookmark, MessageCircle, Eye } from 'lucide-react'
import './MyPage.css'
import '../../styles/jobForm.css'

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
        <AlertModal align="center" message="아이디가 변경되었습니다." onConfirm={() => onSuccess(loginId)} />
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
        <BaseModal title="아이디 변경" onClose={onClose} actions={
                <div className="mp-modal-btn-row">
                    <button className="mp-modal-btn" onClick={onClose}>취소</button>
                    <button className="mp-modal-btn primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? '처리 중...' : '변경하기'}
                    </button>
                </div>
            }>
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
        </BaseModal>
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
        <AlertModal align="center" message={isSet ? '비밀번호가 설정되었습니다.' : '비밀번호가 변경되었습니다.'} onConfirm={onSuccess} />
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
        <AlertModal align="center" message="닉네임이 변경되었습니다." onConfirm={() => onSuccess(nickname)} />
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
        <AlertModal align="center" message="이름이 변경되었습니다." onConfirm={() => onSuccess(name)} />
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
        <AlertModal align="center" message="이메일이 변경되었습니다." onConfirm={() => onSuccess(fullEmail)} />
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
        <AlertModal align="center" message="주소가 변경되었습니다." onConfirm={() => onSuccess(addr1, addr2)} />
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

function TargetJobSection({ initialJobs, onSuccess, onCancel }) {
    const MAX_SELECT = 3
    const [jobCategories, setJobCategories] = useState([])
    const [activeTab, setActiveTab] = useState(0)
    const [selectedJobs, setSelectedJobs] = useState(
        initialJobs.map(j => ({ categoryId: j.categoryId, categoryName: j.categoryName }))
    )
    const [startDate, setStartDate] = useState(
        initialJobs[0]?.startDate?.replace(/-/g, '.') || ''
    )
    const [endDate, setEndDate] = useState(
        initialJobs[0]?.endDate === '9999-12-31' || !initialJobs[0]?.endDate
            ? '' : initialJobs[0]?.endDate?.replace(/-/g, '.')
    )
    const [isPreparing, setIsPreparing] = useState(
        !initialJobs[0]?.endDate || initialJobs[0]?.endDate === '9999-12-31'
    )
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchCategories()
            .then(data => {
                const jobData = data.filter(c => c.categoryType === 'JOB')
                const tabs = jobData
                    .filter(c => c.depth === 1)
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map(tab => ({
                        id: tab.categoryId,
                        label: tab.categoryName,
                        jobs: jobData
                            .filter(c => c.depth === 2 && c.parentId === tab.categoryId)
                            .sort((a, b) => a.sortOrder - b.sortOrder)
                            .map(job => ({ id: job.categoryId, name: job.categoryName }))
                    }))
                setJobCategories(tabs)
            })
    }, [])

    const currentCategory = jobCategories[activeTab] || { jobs: [] }

    const handleJobToggle = (job) => {
        const isSelected = selectedJobs.some(j => j.categoryId === job.id)
        if (isSelected) {
            setSelectedJobs(prev => prev.filter(j => j.categoryId !== job.id))
        } else {
            if (selectedJobs.length >= MAX_SELECT) return
            setSelectedJobs(prev => [...prev, { categoryId: job.id, categoryName: job.name }])
        }
    }

    const autoFormatDate = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 8)
        if (digits.length <= 4) return digits
        if (digits.length <= 6) return `${digits.slice(0,4)}.${digits.slice(4)}`
        return `${digits.slice(0,4)}.${digits.slice(4,6)}.${digits.slice(6)}`
    }

    const formatDate = (val) => {
        if (!val) return null
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val
        if (/^\d{4}\.\d{2}\.\d{2}$/.test(val)) return val.replace(/\./g, '-')
        return null
    }

    const handleSave = async () => {
        const e = {}
        if (selectedJobs.length > 0 && !startDate)
            e.startDate = '준비 시작일을 입력해 주세요.'
        if (Object.keys(e).length > 0) { setErrors(e); return }

        const payload = selectedJobs.map(j => ({
            categoryId:   j.categoryId,
            categoryName: j.categoryName,
            startDate:    formatDate(startDate),
            endDate:      isPreparing ? null : formatDate(endDate),
        }))

        setLoading(true)
        try {
            await updateTargetJobs(payload)
            onSuccess(payload)
        } catch (err) {
            alert(parseError(err, '목표 직무 변경에 실패했습니다.'))
        } finally {
            setLoading(false)
        }
    }

    return (
    <div className="mp-card">
        <h3 className="mp-card-title">목표 직무</h3>
        <p className="jf-guide-title" style={{ marginBottom: 6 }}>
            준비 중인 직무를 선택해 주세요.
            <span className="jf-guide-sub"> (최대 3개, 선택 사항)</span>
        </p>

        {/* 대분류 탭 */}
        <div className="jf-tabs" style={{ marginBottom: 0 }}>
            {jobCategories.map((cat, idx) => (
                <button key={cat.id}
                    className={`jf-tab ${activeTab === idx ? 'active' : ''}`}
                    onClick={() => setActiveTab(idx)}>
                    {cat.label}
                </button>
            ))}
        </div>
        
        <p className="jf-tab-desc">
            직무를 선택하면 해당 직무 특화 면접 질문으로 면접 질문을 생성할 수 있습니다.
        </p>

        {/* 소분류 칩 */}
        <div className="jf-job-chips" style={{ marginTop: 14 }}>
            {currentCategory.jobs.map(job => {
                const isSelected = selectedJobs.some(j => j.categoryId === job.id)
                const isDisabled = !isSelected && selectedJobs.length >= MAX_SELECT
                return (
                    <button key={job.id}
                        className={`jf-job-chip ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                        onClick={() => handleJobToggle(job)}
                        disabled={isDisabled}>
                        {job.name}
                    </button>
                )
            })}
        </div>

        {/* 선택된 직무 박스 */}
        <div className="jf-selected-box">
            <div className="jf-selected-header">
                <span className="jf-selected-title">선택된 직무 ({selectedJobs.length} / {MAX_SELECT})</span>
                <span className="jf-selected-limit">3개 초과 선택 불가</span>
            </div>
            <div className="jf-selected-chips">
                {selectedJobs.map(j => (
                    <span key={j.categoryId} className="jf-selected-chip">
                        {j.categoryName}
                        <button className="jf-chip-remove"
                            onClick={() => setSelectedJobs(p => p.filter(x => x.categoryId !== j.categoryId))}>
                            X
                        </button>
                    </span>
                ))}
            </div>
        </div>

        {/* 직무 준비기간 */}
        <div className="jf-period">
            <p className="jf-period-label">직무 준비기간</p>
            <div className="jf-period-row">
                <input className={`jf-input ${errors.startDate ? 'jf-input--error' : ''}`}
                    type="text" placeholder="시작일 (YYYY.MM.DD)"
                    value={startDate} maxLength={10}
                    onChange={e => { setStartDate(autoFormatDate(e.target.value)); setErrors({}) }} />
                <span className="jf-period-dash">-</span>
                <input className={`jf-input ${isPreparing ? '' : errors.endDate ? 'jf-input--error' : ''}`}
                    type="text"
                    placeholder={isPreparing ? 'YYYY.MM.DD' : '종료일 (YYYY.MM.DD)'}
                    value={endDate} maxLength={10} disabled={isPreparing}
                    onChange={e => setEndDate(autoFormatDate(e.target.value))} />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                    {errors.startDate && <p className="jf-hint--error">{errors.startDate}</p>}
                </div>
                <div style={{ flex: 1 }}>
                    {errors.endDate && <p className="jf-hint--error">{errors.endDate}</p>}
                </div>
            </div>
            <label className="jf-checkbox-label">
                <input type="checkbox" checked={isPreparing}
                    onChange={e => { setIsPreparing(e.target.checked); if (e.target.checked) setEndDate('') }} />
                준비중
            </label>
            <p className="jf-checkbox-hint">체크 시 종료일 비활성화</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button className="mp-modal-btn" onClick={() => {
                setSelectedJobs(initialJobs.map(j => ({ categoryId: j.categoryId, categoryName: j.categoryName })))
                onCancel()
            }}>취소</button>
            <button className="mp-modal-btn primary" onClick={handleSave} disabled={loading}>
                {loading ? '처리 중...' : '저장'}
            </button>
        </div>
    </div>
)
}

const empAutoFormatDate = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 8)
    if (digits.length <= 4) return digits
    if (digits.length <= 6) return `${digits.slice(0,4)}.${digits.slice(4)}`
    return `${digits.slice(0,4)}.${digits.slice(4,6)}.${digits.slice(6)}`
}

const empFormatDate = (val) => {
    if (!val) return null
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val
    if (/^\d{4}\.\d{2}\.\d{2}$/.test(val)) return val.replace(/\./g, '-')
    return null
}

const newEmpCard = () => ({
    id: Date.now(),
    companyName: '', categoryId: null, categoryName: '',
    startDate: '', endDate: '', isCurrently: true,
})

function EmploymentSection({ initialEmployments, onSuccess, onCancel }) {
    const [jobCategories, setJobCategories] = useState([])
    const [cards, setCards] = useState(
        initialEmployments.length > 0
            ? initialEmployments.map((emp, i) => ({
                id: i,
                companyName: emp.companyName || '',
                categoryId: emp.employmentCategoryId || null,
                categoryName: emp.employmentCategoryName || '',
                startDate: emp.startDate?.replace(/-/g, '.') || '',
                endDate: emp.endDate === '9999-12-31' || !emp.endDate
                    ? '' : emp.endDate?.replace(/-/g, '.'),
                isCurrently: !emp.endDate || emp.endDate === '9999-12-31',
            }))
            : [newEmpCard()]
    )
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [showModalFor, setShowModalFor] = useState(null)

    useEffect(() => {
        fetchCategories()
            .then(data => {
                const jobData = data.filter(c => c.categoryType === 'JOB')
                const tabs = jobData
                    .filter(c => c.depth === 1)
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map(tab => ({
                        id: tab.categoryId,
                        label: tab.categoryName,
                        jobs: jobData
                            .filter(c => c.depth === 2 && c.parentId === tab.categoryId)
                            .sort((a, b) => a.sortOrder - b.sortOrder)
                            .map(job => ({ id: job.categoryId, name: job.categoryName }))
                    }))
                setJobCategories(tabs)
            })
    }, [])

    const handleCardChange = (id, updates) => {
        setCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
        setErrors(prev => {
            const next = { ...prev }
            if (next[id]) Object.keys(updates).forEach(f => { if (next[id]) delete next[id][f] })
            return next
        })
    }

    const handleSave = async () => {
        const errs = {}
        const result = []

        for (const card of cards) {
            const hasInput = card.companyName.trim() || card.categoryId
            if (!hasInput) continue

            const cardErrs = {}
            if (!card.companyName.trim()) cardErrs.companyName = '회사명을 입력해 주세요.'
            if (!card.categoryId) cardErrs.categoryId = '직무 카테고리를 선택해 주세요.'
            if (!card.startDate) cardErrs.startDate = '입사일을 입력해 주세요.'

            if (Object.keys(cardErrs).length > 0) {
                errs[card.id] = cardErrs
            } else {
                result.push({
                    categoryId: card.categoryId,
                    categoryName: card.categoryName,
                    companyName: card.companyName.trim(),
                    startDate: empFormatDate(card.startDate),
                    endDate: card.isCurrently ? null : empFormatDate(card.endDate),
                })
            }
        }

        if (Object.keys(errs).length > 0) { setErrors(errs); return }

        setLoading(true)
        try {
            await updateEmployments(result.length > 0 ? result : [])
            onSuccess(result)
        } catch (err) {
            alert(parseError(err, '재직 이력 변경에 실패했습니다.'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mp-card">
            <h3 className="mp-card-title">재직 이력</h3>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: 16 }}>
                이전 또는 현재 재직 이력을 입력해 주세요. (선택 사항)
            </p>

            {cards.map((card, idx) => (
    <div key={card.id} className="jf-card">
        <div className="jf-card-header">
            <span className="jf-card-title">재직 이력 #{idx + 1}</span>
            <button className="jf-card-delete"
                onClick={() => setCards(p => p.filter(c => c.id !== card.id))}>
                x 삭제
            </button>
        </div>

        {/* 회사명 */}
        <div className="jf-card-field">
            <label className="jf-card-label">회사명</label>
            <input className={`jf-card-input ${errors[card.id]?.companyName ? 'jf-card-input--error' : ''}`}
                type="text" placeholder="회사명을 입력해 주세요."
                value={card.companyName}
                onChange={e => handleCardChange(card.id, { companyName: e.target.value })} />
            {errors[card.id]?.companyName && <p className="jf-hint--error">{errors[card.id].companyName}</p>}
        </div>

        {/* 직무 카테고리 */}
        <div className="jf-card-field">
            <label className="jf-card-label">직무 카테고리</label>
            <div className={`jf-job-trigger ${errors[card.id]?.categoryId ? 'jf-job-trigger--error' : ''}`}
                onClick={() => setShowModalFor(card.id)}>
                {card.categoryId
                    ? <span className="jf-job-trigger-edit">✎ 직무 변경</span>
                    : <span className="jf-job-trigger-placeholder">+ 직무를 선택해 주세요.</span>
                }
            </div>
            {card.categoryId ? (
                <div className="jf-job-selected">
                    <span className="jf-job-chip-selected">
                        {card.categoryName}
                        <button className="jf-job-chip-remove"
                            onClick={() => handleCardChange(card.id, { categoryId: null, categoryName: '' })}>
                            ✕
                        </button>
                    </span>
                </div>
            ) : (
                <p className="jf-job-empty">선택된 직무가 없습니다.</p>
            )}
            {errors[card.id]?.categoryId && <p className="jf-hint--error">{errors[card.id].categoryId}</p>}
        </div>

        {/* 재직 기간 */}
        <div className="jf-card-field">
            <label className="jf-card-label">재직 기간</label>
            <div className="jf-period-row">
                <input className={`jf-card-input ${errors[card.id]?.startDate ? 'jf-card-input--error' : ''}`}
                    type="text" placeholder="입사일 (YYYY.MM.DD)"
                    value={card.startDate} maxLength={10}
                    onChange={e => handleCardChange(card.id, { startDate: empAutoFormatDate(e.target.value) })} />
                <span className="jf-period-dash">-</span>
                <input className={`jf-card-input ${card.isCurrently ? 'jf-card-input--disabled' : errors[card.id]?.endDate ? 'jf-card-input--error' : ''}`}
                    type="text"
                    placeholder={card.isCurrently ? 'YYYY.MM.DD' : '퇴사일 (YYYY.MM.DD)'}
                    value={card.endDate} maxLength={10} disabled={card.isCurrently}
                    onChange={e => handleCardChange(card.id, { endDate: empAutoFormatDate(e.target.value) })} />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                    {errors[card.id]?.startDate && <p className="jf-hint--error">{errors[card.id].startDate}</p>}
                </div>
                <div style={{ flex: 1 }}>
                    {errors[card.id]?.endDate && <p className="jf-hint--error">{errors[card.id].endDate}</p>}
                </div>
            </div>
            <label className="jf-checkbox-label">
                <input type="checkbox" checked={card.isCurrently}
                    onChange={e => handleCardChange(card.id, {
                        isCurrently: e.target.checked,
                        endDate: e.target.checked ? '' : card.endDate
                    })} />
                재직중
            </label>
            <p className="jf-checkbox-hint">재직중 체크 시 퇴사일 비활성화</p>
        </div>

        {showModalFor === card.id && (
            <JobCategoryModal
                jobCategories={jobCategories}
                onConfirm={(job) => {
                    handleCardChange(card.id, { categoryId: job.id, categoryName: job.name })
                    setShowModalFor(null)
                }}
                onClose={() => setShowModalFor(null)}
            />
        )}
    </div>
))}

<button className="jf-add-btn" onClick={() => setCards(p => [...p, newEmpCard()])}>
    + 이력 추가
</button>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button className="mp-modal-btn" onClick={() => {setCards(
                    initialEmployments.length > 0
                        ? initialEmployments.map((emp, i) => ({
                            id: i, companyName: emp.companyName || '',
                            categoryId: emp.employmentCategoryId || null,
                            categoryName: emp.employmentCategoryName || '',
                            startDate: emp.startDate?.replace(/-/g, '.') || '',
                            endDate: emp.endDate === '9999-12-31' || !emp.endDate ? '' : emp.endDate?.replace(/-/g, '.'),
                            isCurrently: !emp.endDate || emp.endDate === '9999-12-31',
                        }))
                        : [newEmpCard()]
                )
                onCancel()
                }}>취소</button>
                <button className="mp-modal-btn primary" onClick={handleSave} disabled={loading}>
                    {loading ? '처리 중...' : '저장'}
                </button>
            </div>
        </div>
    )
}

function ActivityTab() {
    const navigate = useNavigate()
    const [activeMenu, setActiveMenu] = useState('posts') // posts | comments | scraps | likes
    const [items, setItems] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [selectedIds, setSelectedIds] = useState([])
    const [confirmModal, setConfirmModal] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const PAGE_SIZE = 10

    useEffect(() => {
        const loadItems = async () => {
            setLoading(true)
            try {
                let result
                if (activeMenu === 'posts')    result = await fetchMyPosts(page, PAGE_SIZE)
                if (activeMenu === 'comments') result = await fetchMyComments(page, PAGE_SIZE)
                if (activeMenu === 'scraps')   result = await fetchMyScraps(page, PAGE_SIZE)
                if (activeMenu === 'likes')    result = await fetchMyLikes(page, PAGE_SIZE)
                setItems(result || [])
                setTotalCount(result?.[0]?.totalCount || 0)
            } catch (e) {
                console.error(e)
                setItems([])
                setTotalCount(0)
            } finally {
                setLoading(false)
            }
        }

        loadItems()
    }, [activeMenu, page, refreshKey])

    const handleMenuChange = (menu) => {
        setActiveMenu(menu)
        setPage(1)
        setSelectedIds([])
    }

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(items.map(item =>
                activeMenu === 'comments' ? item.commentId : item.postId
            ))
        } else {
            setSelectedIds([])
        }
    }

    const handleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const handleDelete = async () => {
        if (selectedIds.length === 0) return
        try {
            if (activeMenu === 'posts')    await deleteMyPosts(selectedIds)
            if (activeMenu === 'comments') await deleteMyComments(selectedIds)
            if (activeMenu === 'scraps')   await deleteMyScraps(selectedIds)
            if (activeMenu === 'likes')    await deleteMyLikes(selectedIds)
            setConfirmModal(false)
            setSelectedIds([])
            setPage(1)  // page가 이미 1이면 effect가 재실행 안 될 수 있으므로
            // refreshKey로 강제 리렌더링
            setRefreshKey(prev => prev + 1)
        } catch (e) {
            console.error(e)
        }
    }

    const handleItemClick = (item) => {
        const postId = activeMenu === 'comments' ? item.postId : item.postId
        navigate(`/board/${postId}`)
    }

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    const getPageNumbers = () => {
        const range = []
        const delta = 2
        const left = Math.max(1, page - delta)
        const right = Math.min(totalPages, page + delta)
        if (left > 1) range.push(1)
        if (left > 2) range.push('...')
        for (let i = left; i <= right; i++) range.push(i)
        if (right < totalPages - 1) range.push('...')
        if (right < totalPages) range.push(totalPages)
        return range
    }

    const deleteLabel = activeMenu === 'scraps' ? '스크랩 취소'
        : activeMenu === 'likes' ? '좋아요 취소' : '삭제'

    const emptyMessage = activeMenu === 'posts' ? '작성하신 게시글이 없습니다.'
        : activeMenu === 'comments' ? '작성하신 댓글이 없습니다.'
        : activeMenu === 'scraps' ? '스크랩한 게시글이 없습니다.'
        : '좋아요한 게시글이 없습니다.'

    return (
        <div className="mp-card">
            {/* 메뉴 */}
            <div className="mp-activity-menu">
                <button
                    className={`mp-activity-menu-item ${activeMenu === 'posts' ? 'active' : ''}`}
                    onClick={() => handleMenuChange('posts')}
                >
                    작성글
                </button>
                <button
                    className={`mp-activity-menu-item ${activeMenu === 'comments' ? 'active' : ''}`}
                    onClick={() => handleMenuChange('comments')}
                >
                    작성 댓글
                </button>
                <button
                    className={`mp-activity-menu-item ${activeMenu === 'scraps' ? 'active' : ''}`}
                    onClick={() => handleMenuChange('scraps')}
                >
                    스크랩글
                </button>
                <button
                    className={`mp-activity-menu-item ${activeMenu === 'likes' ? 'active' : ''}`}
                    onClick={() => handleMenuChange('likes')}
                >
                    좋아요글
                </button>
            </div>

            {/* 목록 */}
            <div className="mp-activity-list">
                {loading ? (
                    <div className="mp-activity-empty">로딩 중...</div>
                ) : items.length === 0 ? (
                    <div className="mp-activity-empty">{emptyMessage}</div>
                ) : (
                    items.map(item => {
                        const id = activeMenu === 'comments' ? item.commentId : item.postId
                        const isSelected = selectedIds.includes(id)
                        return (
                            <div key={id} className="mp-activity-item">
                                <input
                                    type="checkbox"
                                    className="mp-activity-checkbox"
                                    checked={isSelected}
                                    onChange={() => handleSelect(id)}
                                    onClick={e => e.stopPropagation()}
                                />
                                <div
                                    className="mp-activity-content"
                                    onClick={() => handleItemClick(item)}
                                >
                                    {activeMenu === 'comments' ? (
                                        <>
                                            <div className="mp-activity-title">{item.content}</div>
                                            <div className="mp-activity-meta">
                                                <span>{item.categoryName}</span>
                                                <span>·</span>
                                                <span>{item.nickname}</span>
                                                <span>·</span>
                                                <span>{item.createdAt?.slice(0, 10)}</span>
                                                <span>·</span>
                                                <span>조회수 {item.viewCount ?? 0}</span>
                                            </div>
                                            <div className="mp-activity-post-title">{item.postTitle}</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mp-activity-title">{item.title}</div>
                                            <div className="mp-activity-meta">
                                                <span>{item.categoryName}</span>
                                                <span>·</span>
                                                <span>{item.nickname}</span>
                                                <span>·</span>
                                                <span>{item.createdAt?.slice(0, 10)}</span>
                                                <span>·</span>
                                                <span>조회수 {item.viewCount ?? 0}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="mp-activity-counts">
                                    {activeMenu !== 'comments' && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Heart size={13} /> {item.likeCount ?? 0}
                                        </span>
                                    )}
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <Bookmark size={13} /> {item.scrapCount ?? 0}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <MessageCircle size={13} /> {item.commentCount ?? 0}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* 하단: 전체선택 + 삭제 + 글작성 + 페이징 */}
            {items.length > 0 && (
                <div className="mp-activity-footer">
                    <label className="mp-activity-select-all">
                        <input
                            type="checkbox"
                            checked={selectedIds.length === items.length && items.length > 0}
                            onChange={handleSelectAll}
                        />
                        전체 선택
                    </label>
                    <div className="mp-activity-footer-btns">
                        <button
                            className="mp-modal-btn danger"
                            onClick={() => {
                                if (selectedIds.length === 0) return
                                setConfirmModal(true)
                            }}
                            disabled={selectedIds.length === 0}
                        >
                            {deleteLabel}
                        </button>
                        <button
                            className="mp-modal-btn primary"
                            onClick={() => navigate('/board/write')}
                        >
                            글 작성
                        </button>
                    </div>
                </div>
            )}

            {/* 페이징 */}
            {totalPages > 1 && (
                <div className="mp-activity-paging">
                    <button onClick={() => setPage(1)} disabled={page === 1}>{'<<'}</button>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>{'<'}</button>
                    {getPageNumbers().map((p, i) =>
                        p === '...'
                            ? <span key={`e-${i}`} className="mp-page-ellipsis">...</span>
                            : <button
                                key={`page-${p}`}
                                className={page === p ? 'active' : ''}
                                onClick={() => setPage(p)}
                            >{p}</button>
                    )}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>{'>'}</button>
                    <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>{'>>'}</button>
                </div>
            )}

            {/* 삭제 확인 모달 */}
            {confirmModal && (
                <BaseModal
                    title={activeMenu === 'scraps' ? '스크랩 취소'
                        : activeMenu === 'likes' ? '좋아요 취소' : '게시글 삭제'}
                    onClose={() => setConfirmModal(false)}
                    actions={
                        <div className="mp-modal-btn-row">
                            <button className="mp-modal-btn" onClick={() => setConfirmModal(false)}>취소</button>
                            <button className="mp-modal-btn danger" onClick={handleDelete}>
                                {deleteLabel}
                            </button>
                        </div>
                    }
                >
                    <p className="mp-modal-help-text">
                        {activeMenu === 'scraps' ? '선택한 게시글의 스크랩을 취소하시겠습니까?'
                            : activeMenu === 'likes' ? '선택한 게시글의 좋아요를 취소하시겠습니까?'
                            : activeMenu === 'comments' ? '선택한 댓글을 삭제하시겠습니까?'
                            : '선택한 게시글을 삭제하시겠습니까?'}
                    </p>
                </BaseModal>
            )}
        </div>
    )
}

// ── 메인 마이페이지
export default function MyPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, login } = useAuthStore()
    const [tab, setTab] = useState('account')
    const handleTabChange = (newTab) => {
        setTab(newTab)
        setEditingTargetJob(false)
        setEditingEmployment(false)
    }
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

    const [editingTargetJob, setEditingTargetJob] = useState(false)
    const [editingEmployment, setEditingEmployment] = useState(false)


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
                        <button className={`mp-sidebar-item ${tab === 'account' ? 'active' : ''}`} onClick={() => handleTabChange('account')}>로그인 정보</button>
                        <button className={`mp-sidebar-item ${tab === 'profile' ? 'active' : ''}`} onClick={() => handleTabChange('profile')}>회원 정보</button>
                        <button className={`mp-sidebar-item ${tab === 'targetJob' ? 'active' : ''}`} onClick={() => handleTabChange('targetJob')}>목표 직무</button>
                        <button className={`mp-sidebar-item ${tab === 'employment' ? 'active' : ''}`} onClick={() => handleTabChange('employment')}>재직 이력</button>
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
                        !editingTargetJob ? (
                            <div className="mp-card">
                                <div className="mp-section-header">
                                    <h3 className="mp-card-title mp-card-title--compact">목표 직무</h3>
                                    <button className="mp-row-btn" onClick={() => setEditingTargetJob(true)}>목표 직무 변경</button>
                                </div>
                                {info?.targetJobs?.length > 0 ? (
                                    info.targetJobs.map((job, i) => (
                                        <div key={i} className="mp-row mp-target-job-row">
                                            <span className="mp-target-job-name">{job.categoryName}</span>
                                            <span className="mp-target-job-period">
                                                {job.startDate} ~ {job.endDate === '9999-12-31' || !job.endDate ? '준비중' : job.endDate}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="mp-empty-message">등록된 목표 직무가 없습니다.</p>
                                )}
                            </div>
                        ) : (
                            <TargetJobSection
                                initialJobs={info?.targetJobs || []}
                                onSuccess={(jobs) => {
                                    setInfo(p => ({ ...p, targetJobs: jobs }))
                                    setEditingTargetJob(false)
                                    setResultModal({ type: 'success', message: '목표 직무가 변경되었습니다.' })
                                }}
                                onCancel={() => setEditingTargetJob(false)}
                            />
                        )
                    )}

                    {/* 재직 이력 */}
                    {tab === 'employment' && (
                        !editingEmployment ? (
                            <div className="mp-card">
                                <div className="mp-section-header">
                                    <h3 className="mp-card-title mp-card-title--compact">재직 이력</h3>
                                    <button className="mp-row-btn" onClick={() => setEditingEmployment(true)}>재직 이력 변경</button>
                                </div>
                                {info?.employments?.length > 0 ? (
                                    info.employments.map((emp, i) => (
                                        <div key={i} className="mp-row mp-employment-row">
                                            <span className="mp-employment-company">{emp.companyName}</span>
                                            <span className="mp-employment-category">{emp.categoryName}</span>
                                            <span className="mp-employment-period">
                                                {emp.startDate} ~ {emp.endDate === '9999-12-31' || !emp.endDate ? '재직중' : emp.endDate}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="mp-empty-message">등록된 재직 이력이 없습니다.</p>
                                )}
                            </div>
                        ) : (
                            <EmploymentSection
                                initialEmployments={info?.employments || []}
                                onSuccess={(employments) => {
                                    setInfo(p => ({ ...p, employments }))
                                    setEditingEmployment(false)
                                    setResultModal({ type: 'success', message: '재직 이력이 변경되었습니다.' })
                                }}
                                onCancel={() => setEditingEmployment(false)}
                            />
                        )
                    )}
                    
                    {/* 내 활동 */}
                    {tab === 'activity' && (
                        <ActivityTab />
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
                <AlertModal
                    align="center"
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