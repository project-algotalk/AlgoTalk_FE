// src/pages/auth/SignupStep2Page.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCategories } from '../../api/csCategoryApi'

const MAX_SELECT = 3

// 날짜 자동 포맷 (숫자 입력 -> YYYY.MM.DD)
const autoFormatDate = (val) => {
  const digits = val.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 4) return digits
  if (digits.length <= 6) return `${digits.slice(0,4)}.${digits.slice(4)}`
  return `${digits.slice(0,4)}.${digits.slice(4,6)}.${digits.slice(6)}`
}

// YYYY.MM.DD -> YYYY-MM-DD (백엔드 전송용)
const formatDate = (val) => {
  if (!val) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(val)) return val.replace(/\./g, '-')
  if (/^\d{8}$/.test(val)) return `${val.slice(0,4)}-${val.slice(4,6)}-${val.slice(6,8)}`
  return val.replace(/\./g, '-')
}

// YYYY-MM-DD 형식 + 실제 날짜 유효성 검증
const isValidDate = (val) => {
    if (!val) return true // 선택 입력이면 빈 값 허용
    const formatted = formatDate(val) // YYYY-MM-DD로 변환
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formatted)) return false

    const [y, m, d] = formatted.split('-').map(Number)
    if (m < 1 || m > 12) return false
    if (d < 1 || d > 31) return false

    // Date 객체로 실제 유효성 확인 (2월 30일 같은 케이스)
    const date = new Date(y, m - 1, d)
    return date.getFullYear() === y &&
           date.getMonth() === m - 1 &&
           date.getDate() === d
}

export default function SignupStep2Page() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab]       = useState(0)
  const [selectedJobs, setSelectedJobs] = useState([])
  const [startDate, setStartDate]       = useState('')
  const [endDate, setEndDate]           = useState('')
  const [isPreparing, setIsPreparing]   = useState(true)
  const [errors, setErrors]             = useState({})
  const [jobCategories, setJobCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  useEffect(() => {
      fetchCategories()
          .then(data => {
              // JOB 타입만 필터링
              const jobData = data.filter(c => c.categoryType === 'JOB')

              // DEPTH 1 = 대분류 탭
              const tabs = jobData
                  .filter(c => c.depth === 1)
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map(tab => ({
                      id: tab.categoryId,
                      label: tab.categoryName,
                      // DEPTH 2 중 parentId가 이 탭의 id인 것
                      jobs: jobData
                          .filter(c => c.depth === 2 && c.parentId === tab.categoryId)
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map(job => ({
                              id: job.categoryId,
                              name: job.categoryName,
                          }))
                  }))

              setJobCategories(tabs)
          })
          .catch(() => alert('카테고리를 불러오는데 실패했습니다.'))
          .finally(() => setCategoriesLoading(false))
  }, [])

  // 기존 JOB_CATEGORIES 상수 삭제
  // const currentCategory = JOB_CATEGORIES[activeTab] -> 아래로 교체
  const currentCategory = jobCategories[activeTab] || { jobs: [] }

  if (categoriesLoading) return <div>로딩 중...</div>

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

      if (selectedJobs.length > 0) {
          // 직무 선택한 경우에만 시작일 필수
          if (!startDate) {
              e.startDate = '준비 시작일을 입력해 주세요.'
          } else if (!isValidDate(startDate)) {
              e.startDate = '올바른 날짜를 입력해 주세요. (예: 2026.01.01)'
          }
          if (!isPreparing) {
              if (!endDate) {
                  e.endDate = '종료일을 입력해 주세요.'
              } else if (!isValidDate(endDate)) {
                  e.endDate = '올바른 날짜를 입력해 주세요. (예: 2026.01.01)'
              }
              if (startDate && endDate && isValidDate(startDate) && isValidDate(endDate)) {
                  if (new Date(formatDate(startDate)) > new Date(formatDate(endDate)))
                      e.endDate = '종료일은 시작일 이후여야 합니다.'
              }
          }
      } else {
          // 직무 선택 안 했어도 날짜 입력한 경우 형식 검증
          if (startDate && !isValidDate(startDate))
              e.startDate = '올바른 날짜를 입력해 주세요. (예: 2026.01.01)'
          if (!isPreparing && endDate && !isValidDate(endDate))
              e.endDate = '올바른 날짜를 입력해 주세요. (예: 2026.01.01)'
      }

      return e
  }

  const handlePrev = () => {
    const isSocialSignup = sessionStorage.getItem('oauth-temp-token')
    if (isSocialSignup) {
      // 소셜 회원가입은 이전으로 갈 곳이 없음 -> 로그인으로
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

        <p className="jf-guide-title">
          준비 중인 직무를 선택해 주세요.
          <span className="jf-guide-sub"> (최대 3개, 선택 사항)</span>
        </p>
        <p className="su2-guide-desc">
          분류 &nbsp;<span className="su2-guide-em">탭 선택 → 해당 직무 목록 표시</span>
        </p>

        {/* 대분류 탭 */}
        <div className="jf-tabs">
          {jobCategories.map((cat, idx) => (
            <button
              key={cat.id}
              className={`jf-tab ${activeTab === idx ? 'active' : ''}`}
              onClick={() => setActiveTab(idx)}
              type="button"
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p className="jf-tab-desc">
          직무를 선택하면 해당 직무 특화 면접 질문으로 면접 질문을 생성할 수 있습니다.
        </p>

        {/* 중분류 칩 */}
        <div className="jf-job-chips">
          {currentCategory.jobs.map(job => {
            const isSelected = selectedJobs.some(j => j.categoryId === job.id)
            const isDisabled = !isSelected && selectedJobs.length >= MAX_SELECT
            return (
              <button
                key={job.id}
                className={`jf-job-chip ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
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
        <div className="jf-selected-box">
          <div className="jf-selected-header">
            <span className="jf-selected-title">선택된 직무 ( {selectedJobs.length} / {MAX_SELECT} )</span>
            <span className="jf-selected-limit">3개 초과 선택 불가</span>
          </div>
          <div className="jf-selected-chips">
            {selectedJobs.map(j => (
              <span key={j.categoryId} className="jf-selected-chip">
                {j.categoryName}
                <button className="jf-chip-remove" onClick={() => handleRemoveJob(j.categoryId)} type="button">X</button>
              </span>
            ))}
          </div>
        </div>

        {/* 직무 준비기간 */}
        <div className="jf-period">
          <p className="jf-period-label">직무 준비기간</p>
          <div className="jf-period-row">
              <input
                  className={`jf-input ${errors.startDate ? 'jf-input--error' : ''}`}
                  type="text"
                  placeholder="시작일 (YYYY.MM.DD)"
                  value={startDate}
                  onChange={e => {
                      setStartDate(autoFormatDate(e.target.value))
                      setErrors(prev => ({ ...prev, startDate: '' }))
                  }}
                  maxLength={10}
              />
              <span className="jf-period-dash">-</span>
              <input
                  className={`jf-input ${errors.endDate ? 'jf-input--error' : ''}`}
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
          {/* 에러 메시지를 두 칸으로 나눠서 input 위치에 맞게 표시 */}
          <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                  {errors.startDate && <p className="jf-hint--error">{errors.startDate}</p>}
              </div>
              <div style={{ flex: 1 }}>
                  {errors.endDate && <p className="jf-hint--error">{errors.endDate}</p>}
              </div>
          </div>
          <label className="jf-checkbox-label">
              <input type="checkbox" checked={isPreparing} onChange={handlePreparingChange} />
              준비중
          </label>
          <p className="jf-checkbox-hint">체크 시 종료일 비활성화</p>
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