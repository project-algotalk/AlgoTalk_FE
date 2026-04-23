// src/pages/auth/SignupStep3Page.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axiosInstance'
import './SignupStep3Page.css'

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
  { id: 24, label: '기타', jobs: [] },
]

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
function JobModal({ onConfirm, onClose, initialCategoryId, initialCategoryName }) {
  const [activeTab, setActiveTab] = useState(0)
  const [selected, setSelected]   = useState(
    initialCategoryId && initialCategoryId !== 24
      ? { id: initialCategoryId, name: initialCategoryName }
      : null
  )
  const [customText, setCustomText] = useState(
    initialCategoryId === 24 ? initialCategoryName : ''
  )

  const currentCat = JOB_CATEGORIES[activeTab]
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
    <div className="su3-modal-overlay" onClick={onClose}>
      <div className="su3-modal" onClick={e => e.stopPropagation()}>
        <h2 className="su3-modal-title">직무 선택</h2>
        <div className="su3-modal-tabs">
          {JOB_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.id}
              className={`su3-modal-tab ${activeTab === idx ? 'active' : ''}`}
              onClick={() => { setActiveTab(idx); setSelected(null) }}
              type="button"
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="su3-modal-body">
          {isEtc ? (
            <div className="su3-modal-etc">
              <p className="su3-modal-etc-guide">목록에 없는 직무를 직접 입력 해주세요.</p>
              <input
                className="su3-modal-etc-input"
                type="text"
                placeholder="예: 블록체인 개발자, VR 개발자 등"
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                autoFocus
              />
              <p className="su3-modal-etc-hint">입력 후 "선택 완료"를 눌러 저장하세요.</p>
            </div>
          ) : (
            <div className="su3-modal-chips">
              {currentCat.jobs.map(job => (
                <button
                  key={job.id}
                  className={`su3-modal-chip ${selected?.id === job.id ? 'selected' : ''}`}
                  onClick={() => setSelected({ id: job.id, name: job.name })}
                  type="button"
                >
                  {job.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="su3-modal-footer">
          <span className="su3-modal-selected-text">
            선택: <strong>{selectedLabel}</strong>
          </span>
          <div className="su3-modal-btns">
            <button className="su3-modal-btn su3-modal-btn--cancel" onClick={onClose} type="button">취소</button>
            <button
              className="su3-modal-btn su3-modal-btn--confirm"
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
  )
}

// 재직이력 카드
function CareerCard({ card, index, onChange, onRemove, errors }) {
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
    <div className="su3-card">
      <div className="su3-card-header">
        <span className="su3-card-title">재직 이력 #{index + 1}</span>
        <button className="su3-card-delete" onClick={() => onRemove(card.id)} type="button">x 삭제</button>
      </div>

      {/* 회사명 */}
      <div className="su3-card-field">
        <label className="su3-card-label">회사명</label>
        <input
          className={`su3-card-input ${errors?.companyName ? 'su3-card-input--error' : ''}`}
          type="text"
          placeholder="회사명을 입력해 주세요."
          value={card.companyName}
          onChange={e => handleField('companyName', e.target.value)}
        />
        {errors?.companyName && <p className="su3-hint--error">{errors.companyName}</p>}
      </div>

      {/* 직무 카테고리 */}
      <div className="su3-card-field">
        <label className="su3-card-label">직무 카테고리</label>
        <div className={`su3-job-trigger ${errors?.categoryId ? 'su3-job-trigger--error' : ''}`} onClick={() => setShowModal(true)}>
          {card.categoryId
            ? <span className="su3-job-trigger-edit">✎ 직무 변경</span>
            : <span className="su3-job-trigger-placeholder">+ 직무를 선택해 주세요.</span>
          }
        </div>
        {card.categoryId ? (
          <div className="su3-job-selected">
            <span className="su3-job-chip">
              {card.categoryName}
              <button className="su3-job-chip-remove" onClick={handleRemoveJob} type="button">✕</button>
            </span>
          </div>
        ) : (
          <p className="su3-job-empty">선택된 직무가 없습니다.</p>
        )}
        {errors?.categoryId && <p className="su3-hint--error">{errors.categoryId}</p>}
      </div>

      {/* 재직 기간 */}
      <div className="su3-card-field">
        <label className="su3-card-label">재직 기간</label>
        <div className="su3-period-row">
          <input
            className={`su3-card-input ${errors?.startDate ? 'su3-card-input--error' : ''}`}
            type="text"
            placeholder="입사일 (YYYY.MM.DD)"
            value={card.startDate}
            onChange={e => handleField('startDate', autoFormatDate(e.target.value))}
            maxLength={10}
          />
          <span className="su3-period-dash">-</span>
          <input
            className={`su3-card-input ${card.isCurrently ? 'su3-card-input--disabled' : ''}`}
            type="text"
            placeholder={card.isCurrently ? 'YYYY.MM.DD' : '퇴사일 (YYYY.MM.DD)'}
            value={card.endDate}
            onChange={e => handleField('endDate', autoFormatDate(e.target.value))}
            disabled={card.isCurrently}
            maxLength={10}
          />
        </div>
        {errors?.startDate && <p className="su3-hint--error">{errors.startDate}</p>}
        <label className="su3-checkbox-label">
          <input type="checkbox" checked={card.isCurrently} onChange={handleCurrentlyChange} />
          재직중
        </label>
        <p className="su3-checkbox-hint">재직중 체크 시 퇴사일 비활성화</p>
      </div>

      {showModal && (
        <JobModal
          onConfirm={handleJobConfirm}
          onClose={() => setShowModal(false)}
          initialCategoryId={card.categoryId}
          initialCategoryName={card.categoryName}
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
      if (!card.companyName.trim()) continue  // 회사명 없으면 무시

      const cardErrs = {}
      if (!card.categoryId) cardErrs.categoryId = '직무 카테고리를 선택해 주세요.'
      if (!card.startDate)  cardErrs.startDate  = '입사일을 입력해 주세요.'

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
      const step1 = JSON.parse(sessionStorage.getItem('signup-step1') || '{}')
      const step2 = JSON.parse(sessionStorage.getItem('signup-step2') || '{}')

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
          />
        ))}

        <button className="su3-add-btn" type="button" onClick={handleAddCard}>
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