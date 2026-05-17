// 직무 선택 전용 모달
import { useState } from 'react'

export default function JobCategoryModal({ jobCategories, onConfirm, onClose }) {
  const [activeTab, setActiveTab] = useState(0)
  const [selected, setSelected] = useState(null)
  const [customText, setCustomText] = useState('')
  const currentCat = jobCategories[activeTab] || { jobs: [] }
  const isEtc = currentCat.id === 24

  const selectedLabel = isEtc ? customText : selected?.name || ''

  const handleConfirm = () => {
    if (isEtc) return customText.trim() ? onConfirm({ id: 24, name: customText.trim() }) : null
    if (selected) onConfirm(selected)
  }

  return (
    <div className="jf-modal-overlay" onClick={onClose}>
      <div className="jf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="jf-modal-content">
          <h2 className="jf-modal-title">직무 선택</h2>
          <div className="jf-modal-tabs-scroll">
            <div className="jf-modal-tabs">
              {jobCategories.map((cat, idx) => (
                <button key={cat.id} className={`jf-modal-tab ${activeTab === idx ? 'active' : ''}`} onClick={() => { setActiveTab(idx); setSelected(null); setCustomText('') }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="jf-modal-body">
            {isEtc ? (
              <div>
                <p className="mp-modal-help-text">목록에 없는 직무를 직접 입력 해주세요.</p>
                <input className="jf-card-input mp-modal-full-width" type="text" placeholder="예: 블록체인 개발자, VR 개발자 등" value={customText} onChange={(e) => setCustomText(e.target.value)} autoFocus />
                <p className="mp-modal-sub-help-text">입력 후 "선택 완료"를 눌러 저장하세요.</p>
              </div>
            ) : (
              <div className="jf-modal-chips">
                {currentCat.jobs.map((job) => (
                  <button key={job.id} className={`jf-modal-chip ${selected?.id === job.id ? 'selected' : ''}`} onClick={() => setSelected({ id: job.id, name: job.name })}>
                    {job.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="jf-modal-footer">
            <span className="jf-modal-selected-text">선택: <strong>{selectedLabel}</strong></span>
            <div className="jf-modal-btns">
              <button className="jf-modal-btn jf-modal-btn--cancel" onClick={onClose}>취소</button>
              <button className="jf-modal-btn jf-modal-btn--confirm" onClick={handleConfirm} disabled={isEtc ? !customText.trim() : !selected}>선택 완료</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}