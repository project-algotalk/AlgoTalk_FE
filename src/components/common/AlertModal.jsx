import './AlertModal.css'

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
  const iconColor = type === 'success' ? '#1a7f4b' : '#d32f2f'

  return (
    <div className="alert-modal-overlay" onClick={onClose || onConfirm} style={zIndex ? { zIndex } : undefined}>
      <div className={`alert-modal-box alert-modal-box--${align}`} onClick={(e) => e.stopPropagation()}>
        <div className="alert-modal-icon">
          {type === 'success' ? (
            <svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" stroke={iconColor} strokeWidth="2.5" fill="none" /><path d="M14 24l7 7 13-14" stroke={iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          ) : (
            <svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" stroke={iconColor} strokeWidth="2.5" fill="none" /><path d="M16 16l16 16M32 16L16 32" stroke={iconColor} strokeWidth="2.5" strokeLinecap="round" /></svg>
          )}
        </div>
        {title && <h2 className="alert-modal-title">{title}</h2>}
        <p className="alert-modal-message">{message}</p>
        <button className="alert-modal-confirm" onClick={onConfirm}>{confirmText}</button>
      </div>
    </div>
  )
}