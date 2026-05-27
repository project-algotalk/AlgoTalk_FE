// src/pages/auth/SignupStep3Page.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axiosInstance'
import { fetchCategories } from '../../api/csCategoryApi'
import './SignupStep3Page.css'
import '../../styles/jobForm.css'

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

const newCard = () => ({
  id: Date.now(),
  companyName: '',
  categoryId: null,
  categoryName: '',
  isCustom: false,
  startDate: '',
  endDate: '',
  isCurrently: true,
})

// 직무 선택 모달
function JobModal({ onConfirm, onClose, initialCategoryId, initialCategoryName, jobCategories }) {
  const [activeTab, setActiveTab] = useState(0)
  const [selected, setSelected]   = useState(
    initialCategoryId && initialCategoryId !== 24
      ? { id: initialCategoryId, name: initialCategoryName }
      : null
  )
  const [customText, setCustomText] = useState(
    initialCategoryId === 24 ? initialCategoryName : ''
  )

  const currentCat = jobCategories[activeTab] || { jobs: [] }
    const isEtc = currentCat.id === 24

  const handleConfirm = () => {
    if (isEtc) {
      if (!customText.trim()) return
      onConfirm({ id: 24, name: customText.trim() })
    } else {
      if (!selected) return
      onConfirm(selected)
    }
  }

  const selectedLabel = isEtc ? customText : selected?.name || ''

  return (
    <div className="jf-modal-overlay" onClick={onClose}>
      <div className="jf-modal" onClick={e => e.stopPropagation()}>
        <div className="jf-modal-content">
          <h2 className="jf-modal-title">직무 선택</h2>

          {/* 탭 스크롤 래퍼 */}
          <div className="jf-modal-tabs-scroll">
            <div className="jf-modal-tabs">
              {jobCategories.map((cat, idx) => (
                <button
                  key={cat.id}
                  className={`jf-modal-tab ${activeTab === idx ? 'active' : ''}`}
                  onClick={() => { setActiveTab(idx); setSelected(null) }}
                  type="button"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="jf-modal-body">
            {isEtc ? (
              <div className="jf-modal-etc">
                <p className="jf-modal-etc-guide">목록에 없는 직무를 직접 입력 해주세요.</p>
                <input
                  className="jf-card-input"
                  type="text"
                  placeholder="예: 블록체인 개발자, VR 개발자 등"
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                  autoFocus
                  style={{ marginBottom: 6, width: '100%', boxSizing: 'border-box' }}
                />
                <p className="jf-modal-etc-hint">입력 후 "선택 완료"를 눌러 저장하세요.</p>
              </div>
            ) : (
              <div className="jf-modal-chips">
                {currentCat.jobs.map(job => (
                  <button
                    key={job.id}
                    className={`jf-modal-chip ${selected?.id === job.id ? 'selected' : ''}`}
                    onClick={() => setSelected({ id: job.id, name: job.name })}
                    type="button"
                  >
                    {job.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="jf-modal-footer">
            <span className="jf-modal-selected-text">
              선택: <strong>{selectedLabel}</strong>
            </span>
            <div className="jf-modal-btns">
              <button className="jf-modal-btn jf-modal-btn--cancel" onClick={onClose} type="button">취소</button>
              <button
                className="jf-modal-btn jf-modal-btn--confirm"
                onClick={handleConfirm}
                type="button"
                disabled={isEtc ? !customText.trim() : !selected}
              >
                선택 완료
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 재직이력 카드
function CareerCard({ card, index, onChange, onRemove, errors, jobCategories }) {
  const [showModal, setShowModal] = useState(false)

  const handleField = (field, value) => onChange(card.id, { [field]: value })

  const handleJobConfirm = (job) => {
    onChange(card.id, { categoryId: job.id, categoryName: job.name, isCustom: job.id === 24 })
    setShowModal(false)
  }

  const handleRemoveJob = () => {
    onChange(card.id, { categoryId: null, categoryName: '', isCustom: false })
  }

  const handleCurrentlyChange = (e) => {
    onChange(card.id, {
      isCurrently: e.target.checked,
      endDate: e.target.checked ? '' : card.endDate,
    })
  }

  return (
    <div className="jf-card">
      <div className="jf-card-header">
        <span className="jf-card-title">재직 이력 #{index + 1}</span>
        <button className="jf-card-delete" onClick={() => onRemove(card.id)} type="button">x 삭제</button>
      </div>

      {/* 회사명 */}
      <div className="jf-card-field">
        <label className="jf-card-label">회사명</label>
        <input
          className={`jf-card-input ${errors?.companyName ? 'jf-card-input--error' : ''}`}
          type="text"
          placeholder="회사명을 입력해 주세요."
          value={card.companyName}
          onChange={e => handleField('companyName', e.target.value)}
        />
        {errors?.companyName && <p className="jf-hint--error">{errors.companyName}</p>}
      </div>

      {/* 직무 카테고리 */}
      <div className="jf-card-field">
        <label className="jf-card-label">직무 카테고리</label>
        <div className={`jf-job-trigger ${errors?.categoryId ? 'jf-job-trigger--error' : ''}`} onClick={() => setShowModal(true)}>
          {card.categoryId
            ? <span className="jf-job-trigger-edit">✎ 직무 변경</span>
            : <span className="jf-job-trigger-placeholder">+ 직무를 선택해 주세요.</span>
          }
        </div>
        {card.categoryId ? (
          <div className="jf-job-selected">
            <span className="jf-job-chip-selected">
              {card.categoryName}
              <button className="jf-job-chip-remove" onClick={handleRemoveJob} type="button">✕</button>
            </span>
          </div>
        ) : (
          <p className="jf-job-empty">선택된 직무가 없습니다.</p>
        )}
        {errors?.categoryId && <p className="jf-hint--error">{errors.categoryId}</p>}
      </div>

 {/* 재직 기간 */}
<div className="jf-card-field">
    <label className="jf-card-label">재직 기간</label>
    <div className="su3-period-row">
        <input
            className={`jf-card-input ${errors?.startDate ? 'jf-card-input--error' : ''}`}
            type="text"
            placeholder="입사일 (YYYY.MM.DD)"
            value={card.startDate}
            onChange={e => handleField('startDate', autoFormatDate(e.target.value))}
            maxLength={10}
        />
        <span className="su3-period-dash">-</span>
        <input
            className={`jf-card-input ${card.isCurrently ? 'jf-card-input--disabled' : errors?.endDate ? 'jf-card-input--error' : ''}`}
            type="text"
            placeholder={card.isCurrently ? 'YYYY.MM.DD' : '퇴사일 (YYYY.MM.DD)'}
            value={card.endDate}
            onChange={e => handleField('endDate', autoFormatDate(e.target.value))}
            disabled={card.isCurrently}
            maxLength={10}
        />
    </div>
    {/* 에러 메시지를 두 칸으로 나눠서 input 위치에 맞게 표시 */}
    <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
            {errors?.startDate && <p className="jf-hint--error">{errors.startDate}</p>}
        </div>
        <div style={{ flex: 1 }}>
            {errors?.endDate && <p className="jf-hint--error">{errors.endDate}</p>}
        </div>
    </div>
    <label className="jf-checkbox-label">
        <input type="checkbox" checked={card.isCurrently} onChange={handleCurrentlyChange} />
        재직중
    </label>
    <p className="jf-checkbox-hint">재직중 체크 시 퇴사일 비활성화</p>
</div>

      {showModal && (
          <JobModal
              onConfirm={handleJobConfirm}
              onClose={() => setShowModal(false)}
              initialCategoryId={card.categoryId}
              initialCategoryName={card.categoryName}
              jobCategories={jobCategories}  // 추가
          />
      )}
    </div>
  )
}

export default function SignupStep3Page() {
  const navigate = useNavigate()
  const [cards, setCards]     = useState([newCard()])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})
  const [jobCategories, setJobCategories] = useState([])

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

              // 기타 탭 추가 (depth 1에 기타가 있으면 자동으로 포함됨)
              setJobCategories(tabs)
          })
          .catch(() => alert('카테고리를 불러오는데 실패했습니다.'))
  }, [])

  const handleCardChange = (id, updates) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
    // 해당 카드 에러 초기화
    setErrors(prev => {
      const next = { ...prev }
      if (next[id]) {
        const fields = Object.keys(updates)
        fields.forEach(f => { if (next[id]) delete next[id][f] })
      }
      return next
    })
  }

  const handleCardRemove = (id) => {
    setCards(prev => prev.filter(c => c.id !== id))
    setErrors(prev => { const next = { ...prev }; delete next[id]; return next })
  }

  const handleAddCard = () => setCards(prev => [...prev, newCard()])

  const buildEmployments = () => {
      const result = []
      const errs   = {}

      for (const card of cards) {
          const hasInput = card.companyName.trim() || card.categoryId

          if (!hasInput) continue  // 아무것도 입력 안 했으면 무시

          const cardErrs = {}

          // 회사명 또는 카테고리 중 하나라도 입력하면 나머지도 필수
          if (!card.companyName.trim()) cardErrs.companyName = '회사명을 입력해 주세요.'
          if (!card.categoryId) cardErrs.categoryId = '직무 카테고리를 선택해 주세요.'

          // 입사일 필수
          if (!card.startDate) {
              cardErrs.startDate = '입사일을 입력해 주세요.'
          } else if (!isValidDate(card.startDate)) {
              cardErrs.startDate = '올바른 날짜를 입력해 주세요. (예: 2024.01.01)'
          }

          // 퇴사일 검증 (재직중 아닐 때만)
          if (!card.isCurrently) {
              if (card.endDate && !isValidDate(card.endDate)) {
                  cardErrs.endDate = '올바른 날짜를 입력해 주세요. (예: 2024.01.01)'
              }
              if (card.startDate && card.endDate && isValidDate(card.startDate) && isValidDate(card.endDate)) {
                  if (new Date(formatDate(card.startDate)) > new Date(formatDate(card.endDate)))
                      cardErrs.endDate = '퇴사일은 입사일 이후여야 합니다.'
              }
          }

          if (Object.keys(cardErrs).length > 0) {
              errs[card.id] = cardErrs
          } else {
              result.push({
                  categoryId:   card.categoryId,
                  categoryName: card.categoryName,
                  companyName:  card.companyName.trim(),
                  startDate:    formatDate(card.startDate),
                  endDate:      card.isCurrently ? null : formatDate(card.endDate),
              })
          }
      }

      return { employments: result.length > 0 ? result : null, errors: errs }
  }

  const handleSubmit = async () => {
    const { employments, errors: empErrors } = buildEmployments()

    if (Object.keys(empErrors).length > 0) {
      setErrors(empErrors)
      return
    }

    setLoading(true)
    try {
      const step2 = JSON.parse(sessionStorage.getItem('signup-step2') || '{}')
      const tempToken = sessionStorage.getItem('oauth-temp-token')

      if (tempToken) {
        // 소셜 회원가입
        await api.post('/user/v1/signup/social', {
          tempToken,
          nickname:    null,
          addr1:       null,
          addr2:       null,
          targetJobs:  step2.targetJobs || null,
          employments: employments,
        })
        sessionStorage.removeItem('oauth-temp-token')
      } else {
        // 일반 회원가입
        const step1 = JSON.parse(sessionStorage.getItem('signup-step1') || '{}')
        await api.post('/user/v1/signup', {
          loginId:         step1.loginId,
          password:        step1.password,
          passwordConfirm: step1.passwordConfirm,
          email:           step1.email,
          addr1:           step1.addr1 || null,
          addr2:           step1.addr2 || null,
          name:            step1.name,
          nickname:        step1.nickname || null,
          targetJobs:      step2.targetJobs || null,
          employments:     employments,
        })
        sessionStorage.removeItem('signup-step1')
      }

      sessionStorage.removeItem('signup-step2')
      navigate('/signup/complete')

    } catch (err) {
      const msg = err.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해 주세요.'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="su3-page">
        <nav className="su3-nav"> {/* 또는 su3-nav */}
            <button className="su3-nav-back" onClick={() => navigate('/signup')} type="button">‹</button>
            <span
                className="su3-nav-logo"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            >
                AlgoTalk
            </span>
            <div style={{ width: 40 }} />
        </nav>

      <div className="su3-container">
        {/* 스텝 인디케이터 */}
        <div className="su3-steps">
          <div className="su3-step">
            <div className="su3-step-circle done">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7l4 4 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="su3-step-label done">기본 정보</span>
          </div>
          <div className="su3-step-line done" />
          <div className="su3-step">
            <div className="su3-step-circle done">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7l4 4 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="su3-step-label done">목표 직무</span>
          </div>
          <div className="su3-step-line done" />
          <div className="su3-step">
            <div className="su3-step-circle active">3</div>
            <span className="su3-step-label active">재직 이력</span>
          </div>
        </div>

        <p className="su3-guide">
          이전 또는 현재 재직 이력을 입력해 주세요.
          <span className="su3-guide-sub"> (선택 사항)</span>
        </p>

        {cards.map((card, idx) => (
            <CareerCard
                key={card.id}
                card={card}
                index={idx}
                onChange={handleCardChange}
                onRemove={handleCardRemove}
                errors={errors[card.id]}
                jobCategories={jobCategories}  // 추가
            />
        ))}

        <button className="jf-add-btn" type="button" onClick={handleAddCard}>
          + 이력 추가
        </button>

        <div className="su3-btn-row">
          <button className="su3-btn su3-btn--prev" type="button" onClick={() => navigate('/signup/step2')}>
            이 전
          </button>
          <button
            className="su3-btn su3-btn--submit"
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '처리 중...' : '가입 완료'}
          </button>
        </div>
      </div>
    </div>
  )
}