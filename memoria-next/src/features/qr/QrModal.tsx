"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import type { Profile } from "@/types";

interface QrModalProps {
  url:         string;
  patternName: string;
  profile:     Profile;
  onClose:     () => void;
}

export default function QrModal({ url, patternName, profile, onClose }: QrModalProps) {
  const router  = useRouter();
  const [copied, setCopied] = useState(false);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="qr-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="qr-modal-close" onClick={onClose} aria-label="閉じる">×</button>

        <p className="qr-modal-label">{patternName}</p>

        <div className="qr-box">
          <QRCodeSVG value={url} size={220} includeMargin />
        </div>

        <p className="qr-modal-url">{url}</p>

        <div className="row" style={{ justifyContent: "center", gap: "10px", marginTop: "4px" }}>
          <button type="button" className="button" onClick={() => void copyUrl()}>
            {copied ? "✓ コピーしました" : "URLをコピー"}
          </button>
          <button type="button" className="button secondary" onClick={onClose}>
            閉じる
          </button>
        </div>

        {/* QRカードビルダーへ（ページ遷移） */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px", marginTop: "6px" }}>
          <button
            type="button"
            className="button secondary"
            style={{ width: "100%", gap: "8px" }}
            onClick={() => {
              onClose();
              router.push(`/card/${profile.id}`);
            }}
          >
            🎴 QRカードを作る（PNG保存・シェア）
          </button>
        </div>
      </div>
    </div>
  );
}
