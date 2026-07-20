export default function Toast({
  toast,
  onClose,
}) {
  if (!toast) return null;

  return (
    <div className={`cg-toast ${toast.type}`}>
      <div className="cg-toast-content">
        {toast.message}
      </div>

      <div className="cg-toast-actions">
        <button
          className="cg-toast-btn"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}