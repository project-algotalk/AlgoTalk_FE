// src/pages/auth/SignupStep2Page.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SignupStep2Page.css'

const JOB_CATEGORIES = [
  {
    id: 20, label: '소프트웨어 개발',
    jobs: [
      { id: 100, name: '프론트엔드' },
      { id: 101, name: '백엔드' },
      { id: 102, name: '풀스택' },
      { id: 103, name: '모바일 / 앱' },
      { id: 104, name: '게임' },
      { id: 105, name: '임베디드' },
    ],
  },
  {
    id: 21, label: '데이터 및 인공지능',
    jobs: [
      { id: 110, name: 'AI/머신러닝 엔지니어' },
      { id: 111, name: '데이터 사이언티스트' },
      { id: 112, name: '데이터 엔지니어' },
      { id: 113, name: '프롬프트 엔지니어' },
    ],
  },
  {
    id: 22, label: 'IT 인프라 및 운영',
    jobs: [
      { id: 120, name: '클라우드 엔지니어' },
      { id: 121, name: 'DevOps/SRE' },
      { id: 122, name: '정보보안 전문가' },
      { id: 123, name: '네트워크/시스템 관리자' },
    ],
  },
  {
    id: 23, label: 'IT 기획 및 서비스',
    jobs: [
      { id: 130, name: 'IT 프로젝트 매니저(PM)' },
      { id: 131, name: '서비스 기획자/PO' },
      { id: 132, name: 'UI/UX 디자이너' },
      { id: 133, name: 'QA 엔지니어' },
    ],
  },
]

const MAX_SELECT = 3

// 날짜 자동 포맷 (숫자 입력 → YYYY.MM.DD)
const autoFormatDate = (val) => {
  const digits = val.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 4) return digits
  if (digits.length <= 6) return `${digits.slice(0,4)}.${digits.slice(4)}`
  return `${digits.slice(0,4)}.${digits.slice(4,6)}.${digits.slice(6)}`
}

// YYYY.MM.DD → YYYY-MM-DD (백엔드 전송용)
const formatDate = (val) => {
  if (!val) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(val)) return val.replace(/\./g, '-')
  if (/^\d{8}$/.test(val)) return `${val.slice(0,4)}-${val.slice(4,6)}-${val.slice(6,8)}`
  return val.replace(/\./g, '-')
}

export default function SignupStep2Page() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab]       = useState(0)
  const [selectedJobs, setSelectedJobs] = useState([])
  const [startDate, setStartDate]       = useState('')
  const [endDate, setEndDate]           = useState('')
  const [isPreparing, setIsPreparing]   = useState(true)
  const [errors, setErrors]             = useState({})

  const currentCategory = JOB_CATEGORIES[activeTab]

  const handleJobToggle = (job) => {
    const isSelected = selectedJobs.some(j => j.categoryId === job.id)
    if (isSelected) {
      setSelectedJobs(prev => prev.filter(j => j.categoryId !== job.id))
    } else {
      if (selectedJobs.length >= MAX_SELECT) return
      setSelectedJobs(prev => [...prev, { categoryId: job.id, categoryName: job.name }])
    }
  }

  const handleRemoveJob = (categoryId) => {
    setSelectedJobs(prev => prev.filter(j => j.categoryId !== categoryId))
  }

  const handlePreparingChange = (e) => {
    setIsPreparing(e.target.checked)
    if (e.target.checked) setEndDate('')
    setErrors(prev => ({ ...prev, endDate: '' }))
  }

  const validate = () => {
    const e = {}
    if (!startDate)
      e.startDate = '준비 시작일을 입력해 주세요.'
    if (!isPreparing && !endDate)
      e.endDate = '종료일을 입력해 주세요.'
    return e
  }

  const handlePrev = () => {
    const isSocialSignup = sessionStorage.getItem('oauth-temp-token')
    if (isSocialSignup) {
      // 소셜 회원가입은 이전으로 갈 곳이 없음 → 로그인으로
      navigate('/login')
    } else {
      navigate('/signup')
    }
  }

  const handleNext = () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const targetJobs = selectedJobs.map(j => ({
      categoryId:   j.categoryId,
      categoryName: j.categoryName,
      startDate:    formatDate(startDate),
      endDate:      isPreparing ? null : formatDate(endDate),
    }))

    sessionStorage.setItem('signup-step2', JSON.stringify({ targetJobs }))
    navigate('/signup/step3')
  }

  return (
    <div className="su2-page">
        <nav className="su2-nav"> {/* 또는 su3-nav */}
        <button
          className="su2-nav-back"
          onClick={handlePrev}  // ← navigate('/signup') 대신 handlePrev 사용
          type="button"
        >
          ‹
        </button>
        <span
            className="su2-nav-logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
        >
            AlgoTalk
        </span>
        <div style={{ width: 40 }} />
        </nav>

      <div className="su2-container">

        {/* 스텝 인디케이터 */}
        <div className="su2-steps">
          <div className="su2-step">
            <div className="su2-step-circle done">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7l4 4 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="su2-step-label done">기본 정보</span>
          </div>
          <div className="su2-step-line done" />
          <div className="su2-step">
            <div className="su2-step-circle active">2</div>
            <span className="su2-step-label active">목표 직무</span>
          </div>
          <div className="su2-step-line" />
          <div className="su2-step">
            <div className="su2-step-circle">3</div>
            <span className="su2-step-label">재직 이력</span>
          </div>
        </div>

        <p className="su2-guide-title">
          준비 중인 직무를 선택해 주세요.
          <span className="su2-guide-sub"> (최대 3개, 선택 사항)</span>
        </p>
        <p className="su2-guide-desc">
          분류 &nbsp;<span className="su2-guide-em">탭 선택 → 해당 직무 목록 표시</span>
        </p>

        {/* 대분류 탭 */}
        <div className="su2-tabs">
          {JOB_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.id}
              className={`su2-tab ${activeTab === idx ? 'active' : ''}`}
              onClick={() => setActiveTab(idx)}
              type="button"
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p className="su2-tab-desc">
          직무를 선택하면 해당 직무 특화 면접 질문으로 면접 질문을 생성할 수 있습니다.
        </p>

        {/* 중분류 칩 */}
        <div className="su2-job-chips">
          {currentCategory.jobs.map(job => {
            const isSelected = selectedJobs.some(j => j.categoryId === job.id)
            const isDisabled = !isSelected && selectedJobs.length >= MAX_SELECT
            return (
              <button
                key={job.id}
                className={`su2-job-chip ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                onClick={() => handleJobToggle(job)}
                type="button"
                disabled={isDisabled}
              >
                {job.name}
              </button>
            )
          })}
        </div>

        {/* 선택된 직무 박스 */}
        <div className="su2-selected-box">
          <div className="su2-selected-header">
            <span className="su2-selected-title">선택된 직무 ( {selectedJobs.length} / {MAX_SELECT} )</span>
            <span className="su2-selected-limit">3개 초과 선택 불가</span>
          </div>
          <div className="su2-selected-chips">
            {selectedJobs.map(j => (
              <span key={j.categoryId} className="su2-selected-chip">
                {j.categoryName}
                <button className="su2-chip-remove" onClick={() => handleRemoveJob(j.categoryId)} type="button">X</button>
              </span>
            ))}
          </div>
        </div>

        {/* 직무 준비기간 */}
        <div className="su2-period">
          <p className="su2-period-label">직무 준비기간</p>
          <div className="su2-period-row">
            <input
              className={`su2-input ${errors.startDate ? 'su2-input--error' : ''}`}
              type="text"
              placeholder="시작일 (YYYY.MM.DD)"
              value={startDate}
              onChange={e => {
                setStartDate(autoFormatDate(e.target.value))
                setErrors(prev => ({ ...prev, startDate: '' }))
              }}
              maxLength={10}
            />
            <span className="su2-period-dash">-</span>
            <input
              className={`su2-input ${errors.endDate ? 'su2-input--error' : ''}`}
              type="text"
              placeholder={isPreparing ? 'YYYY.MM.DD' : '종료일 (YYYY.MM.DD)'}
              value={endDate}
              onChange={e => {
                setEndDate(autoFormatDate(e.target.value))
                setErrors(prev => ({ ...prev, endDate: '' }))
              }}
              disabled={isPreparing}
              maxLength={10}
            />
          </div>
          {errors.startDate && <p className="su2-hint--error">{errors.startDate}</p>}
          {errors.endDate   && <p className="su2-hint--error">{errors.endDate}</p>}
          <label className="su2-checkbox-label">
            <input type="checkbox" checked={isPreparing} onChange={handlePreparingChange} />
            준비중
          </label>
          <p className="su2-checkbox-hint">체크 시 종료일 비활성화</p>
        </div>

        {/* 버튼 */}
        <div className="su2-btn-row">
          <button className="su2-btn su2-btn--prev" type="button" onClick={handlePrev}>
            이 전
          </button>
          <button className="su2-btn su2-btn--next" type="button" onClick={handleNext}>
            다 음
          </button>
        </div>

      </div>
    </div>
  )
}