export default function ConfirmModal({ open, title, message, confirmLabel, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          <button onClick={onCancel} className="btn-ghost">Cancel</button>
          <button onClick={onConfirm} className="btn-danger">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
