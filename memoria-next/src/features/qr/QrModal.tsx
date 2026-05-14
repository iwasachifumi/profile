"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QrModalProps {
  url: string;
  patternName: string;
  onClose: () => void;
}

export default function QrModal({ url, patternName, onClose }: QrModalProps) {
  const [copied, setCopied] = useState(false);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  }

  return (
    <div className="qr-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="qr-modal-close"
          onClick={onClose}
          aria-label="閉じる"
        >
          ×
        </button>

        <p className="qr-modal-label">{patternName}</p>

        <div className="qr-box">
          <QRCodeSVG value={url} size={220} includeMargin />
        </div>

        <p className="qr-modal-url">{url}</p>

        <div className="row" style={{ justifyContent: "center", gap: "10px", marginTop: "4px" }}>
          <button
            type="button"
            className="button"
            onClick={() => void copyUrl()}
          >
            {copied ? "✓ コピーしました" : "URLをコピー"}
          </button>
          <button type="button" className="button secondary" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
