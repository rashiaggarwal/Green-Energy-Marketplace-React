import React from "react";
import "../styles/notifications.css";

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, confirming }) {
  if (!open) return null;

  return (
    <div className="cg-modal-backdrop">
      <div className="cg-modal">
        <h3 className="cg-modal-title">{title || "Confirm"}</h3>
        <p className="cg-modal-message">{message}</p>
        <div className="cg-modal-actions">
          <button className="cg-btn cg-btn-secondary" onClick={onCancel} disabled={confirming}>Cancel</button>
          <button className="cg-btn cg-btn-danger" onClick={onConfirm} disabled={confirming}>{confirming ? "Cancelling..." : "Confirm"}</button>
        </div>
      </div>
    </div>
  );
}
