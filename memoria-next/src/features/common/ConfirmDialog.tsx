"use client";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
  danger?: boolean;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  busy = false,
  danger = false,
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onCancel}>
      <div className="modal-dialog stack" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>{message}</p>
        <div className="modal-actions">
          <button type="button" className="button secondary" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className="button"
            onClick={onConfirm}
            disabled={busy}
            style={danger ? { background: "var(--pink)", borderColor: "var(--pink)", color: "#fff" } : undefined}
          >
            {busy ? "..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

