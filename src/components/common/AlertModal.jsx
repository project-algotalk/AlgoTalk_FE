import { useEffect } from 'react'
import { AlertTriangle, Check, X } from 'lucide-react'

export default function AlertModal({
  type = 'success',
  title,
  message,
  confirmText = '확인',
  onConfirm,
  onClose,
  align = 'left',
  zIndex,
}) {
  const dismiss = onClose || onConfirm

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') dismiss?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [dismiss])

  return (
    <div className="alert-modal-overlay" onClick={dismiss} style={zIndex ? { zIndex } : undefined}>
      <div
        className={`alert-modal-box alert-modal-box--${align} alert-modal-box--${type}`}
        onClick={(event) => event.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
      >
        {onClose && (
          <button className="alert-modal-close" type="button" onClick={onClose} aria-label="알림 닫기">
            <X size={17} />
          </button>
        )}
        <div className="alert-modal-icon" aria-hidden="true">
          {type === 'success' ? <Check size={24} /> : <AlertTriangle size={24} />}
        </div>
        {title && <h2 className="alert-modal-title">{title}</h2>}
        <p className="alert-modal-message">{message}</p>
        <button className="alert-modal-confirm" onClick={onConfirm}>{confirmText}</button>
      </div>
    </div>
  )
}
