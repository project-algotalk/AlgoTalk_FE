import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function BaseModal({ title, onClose, actions, children, className = '' }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div className="mp-modal-overlay" onClick={onClose}>
      <div
        className={`mp-modal ${className}`.trim()}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'base-modal-title' : undefined}
      >
        <div className="mp-modal-header">
          {title && <h2 id="base-modal-title" className="mp-modal-title">{title}</h2>}
          {onClose && (
            <button className="mp-modal-close" type="button" onClick={onClose} aria-label="모달 닫기">
              <X size={18} />
            </button>
          )}
        </div>
        <div className="mp-modal-content">{children}</div>
        {actions && <div className="mp-modal-actions">{actions}</div>}
      </div>
    </div>
  )
}
