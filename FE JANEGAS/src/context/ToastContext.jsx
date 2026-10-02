import React, { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null); // { message, onConfirm, onCancel }
  const confirmResolveRef = useRef(null);

  const addToast = useCallback(({ type = "success", message, duration = 3500 }) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const toast = {
    success: (msg, opts) => addToast({ type: "success", message: msg, ...opts }),
    error:   (msg, opts) => addToast({ type: "error",   message: msg, ...opts }),
    warning: (msg, opts) => addToast({ type: "warning", message: msg, ...opts }),
    info:    (msg, opts) => addToast({ type: "info",    message: msg, ...opts }),
  };

  /** Returns a Promise<boolean>. Resolves true if user confirms, false if cancelled. */
  const openConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      confirmResolveRef.current = resolve;
      setConfirm({ message });
    });
  }, []);

  const handleConfirm = () => {
    confirmResolveRef.current?.(true);
    setConfirm(null);
  };

  const handleCancel = () => {
    confirmResolveRef.current?.(false);
    setConfirm(null);
  };

  return (
    <ToastContext.Provider value={{ toast, openConfirm }}>
      {children}

      {/* ─── Toast Stack ─── */}
      <div
        aria-live="polite"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxWidth: 360,
          width: "calc(100vw - 48px)",
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => setToasts((p) => p.filter((x) => x.id !== t.id))} />
        ))}
      </div>

      {/* ─── Confirm Modal ─── */}
      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

/* ────────────────────────────────────────────────────────
   Toast Item
──────────────────────────────────────────────────────── */
const TOAST_STYLES = {
  success: {
    bg: "#f0fdf4",
    border: "#86efac",
    icon: "✓",
    iconBg: "#22c55e",
    titleColor: "#15803d",
  },
  error: {
    bg: "#fff1f2",
    border: "#fca5a5",
    icon: "✕",
    iconBg: "#ef4444",
    titleColor: "#dc2626",
  },
  warning: {
    bg: "#fffbeb",
    border: "#fde68a",
    icon: "⚠",
    iconBg: "#f59e0b",
    titleColor: "#d97706",
  },
  info: {
    bg: "#eff6ff",
    border: "#93c5fd",
    icon: "ℹ",
    iconBg: "#3b82f6",
    titleColor: "#1d4ed8",
  },
};

function ToastItem({ toast, onClose }) {
  const s = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        boxShadow: "0 6px 24px rgba(13,31,15,0.12)",
        animation: "slideInToast 0.3s ease",
        pointerEvents: "all",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: s.iconBg,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 800,
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        {s.icon}
      </div>

      {/* Message */}
      <span
        style={{
          flex: 1,
          fontSize: 13.5,
          fontWeight: 600,
          color: s.titleColor,
          lineHeight: 1.5,
          paddingTop: 4,
        }}
      >
        {toast.message}
      </span>

      {/* Close */}
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: s.titleColor,
          opacity: 0.5,
          fontSize: 14,
          lineHeight: 1,
          padding: 2,
          flexShrink: 0,
          paddingTop: 5,
        }}
        aria-label="Tutup notifikasi"
      >
        ✕
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Confirm Modal
──────────────────────────────────────────────────────── */
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(13,31,15,0.55)",
        backdropFilter: "blur(6px)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 18,
          border: "1px solid var(--border-default)",
          boxShadow: "0 8px 32px rgba(13,31,15,0.20)",
          width: "100%",
          maxWidth: 400,
          animation: "slideUp 0.25s ease",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "22px 26px 18px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            borderBottom: "1px solid var(--border-default)",
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "#fff1f2",
              border: "1px solid #fca5a5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 20,
            }}
          >
            🗑️
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
              Konfirmasi Hapus
            </div>
            <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>
              Tindakan ini tidak bisa dibatalkan
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "18px 26px", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          {message}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 26px 22px",
            borderTop: "1px solid var(--border-default)",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              border: "1px solid var(--border-default)",
              background: "#ffffff",
              color: "var(--text-secondary)",
              fontSize: 13.5,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "var(--bg-base)"}
            onMouseOut={(e) => e.currentTarget.style.background = "#ffffff"}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              border: "none",
              background: "#ef4444",
              color: "#ffffff",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#dc2626"}
            onMouseOut={(e) => e.currentTarget.style.background = "#ef4444"}
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
