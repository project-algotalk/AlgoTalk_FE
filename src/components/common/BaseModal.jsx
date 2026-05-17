// 모달 공통 뼈대
import { useEffect } from 'react'

export default function BaseModal({ title, onClose, actions, children, className = '' }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="mp-modal-overlay" onClick={onClose}>
      <div className={`mp-modal ${className}`.trim()} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {title && <h2 className="mp-modal-title">{title}</h2>}
        {children}
        {actions}
      </div>
    </div>
  )
}
