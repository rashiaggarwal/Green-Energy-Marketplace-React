import React, { useEffect } from "react";
import "../styles/notifications.css";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => {
      onClose && onClose();
    }, toast.duration || 3500);

    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`cg-toast ${toast.type || "info"}`} onClick={onClose}>
      <div className="cg-toast-content">{toast.message}</div>
    </div>
  );
}
