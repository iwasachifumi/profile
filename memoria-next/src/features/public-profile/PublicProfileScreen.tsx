"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { publicApi } from "@/api/public";
import { exchangesApi } from "@/api/exchanges";
import { useSession } from "@/store/session";
import type { Profile } from "@/types";

interface PublicProfileScreenProps {
  slug?:   string;
  handle?: string;
  via?:    string;  // "qr" のとき QR交換フロー
}

const LINK_ICONS: Record<string, string> = {
  x:         "𝕏",
  instagram: "📷",
  github:    "🐙",
  linkedin:  "💼",
  website:   "🔗",
  other:     "🔗",
};

export default function PublicProfileScreen({ slug, handle, via }: PublicProfileScreenProps) {
  const hasIdentifier = Boolean(slug || handle);
  const isQr          = via === "qr";
  const { session }   = useSession();

  const [profile,        setProfile]        = useState<Profile | null>(null);
  const [loading,        setLoading]        = useState(hasIdentifier);
  const [error,          setError]          = useState<string | null>(
    hasIdentifier ? null : "プロフィールが見つかりません。"
  );
  const [exchanged,      setExchanged]      = useState(false);
  const [exchangeBusy,   setExchangeBusy]   = useState(false);
  const [exchangeError,  setExchangeError]  = useState<string | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // ── プロフィール取得 ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!hasIdentifier) return;
    let alive = true;

    const request = slug
      ? publicApi.getBySlug(slug)
      : publicApi.getByHandle(handle ?? "");

    request.then((result) => {
      if (!alive) return;
      setLoading(false);
      if (!result.ok) { setError(result.error); return; }
      setProfile(result.data);
    });

    return () => { alive = false; };
  }, [handle, hasIdentifier, slug]);

  // ── ゲスト向けログイン促進モーダル ──────────────────────────────────────
  // プロフ読み込み完了後、少し間を置いてから表示（閲覧を邪魔しない）

  useEffect(() => {
    if (session.status !== "guest" || !profile) return;
    const timer = setTimeout(() => setLoginModalOpen(true), 1200);
    return () => clearTimeout(timer);
  }, [session.status, profile]);

  // ── 交換記録（ログイン済みのみ） ────────────────────────────────────────

  async function handleExchange() {
    if (!profile || session.status !== "user") return;

    setExchangeBusy(true);
    setExchangeError(null);

    const result = await exchangesApi.create({
      id:              crypto.randomUUID(),
      targetProfileId: profile.id,
      method:          isQr ? "qr" : "manual",
      eventName:       null,
      exchangedAt:     new Date().toISOString(),
      snapshot: {
        patternName: profile.patternName,
        audience:    profile.audience,
        description: profile.description,
        handle:      profile.handle,
        slug:        profile.publicSlug,
      },
      privateNote: "",
      tags: [],
    });

    setExchangeBusy(false);
    if (!result.ok) { setExchangeError(result.error); return; }
    setExchanged(true);
  }

  // ── ログインリターン URL 生成 ────────────────────────────────────────────

  const returnPath = slug
    ? `/profile/${slug}${isQr ? "?via=qr" : ""}`
    : `/profile/handle/${handle ?? ""}${isQr ? "?via=qr" : ""}`;
  const authBase    = `/?return=${encodeURIComponent(returnPath)}`;
  const loginUrl    = authBase;
  const registerUrl = `${authBase}&mode=register`;

  // ── ローディング / エラー ────────────────────────────────────────────────

  if (loading) {
    return (
      <main className="pub-page">
        <div className="pub-card">
          <p className="muted">読み込み中...</p>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="pub-page">
        <div className="pub-card">
          <h1 className="pub-name">プロフィールが見つかりません</h1>
          <p className="muted">{error ?? "このプロフィールは存在しないか、非公開です。"}</p>
          <Link href="/" className="button secondary" style={{ marginTop: "12px" }}>
            トップに戻る
          </Link>
        </div>
      </main>
    );
  }

  const visibleFields = profile.fields.filter((f) => f.visible && f.label && f.value);
  const visibleLinks  = profile.links.filter((l) => l.visible && l.url);

  return (
    <main className="pub-page">
      <div className="pub-card">

        {/* ── QR経由バナー ─────────────────────────────────────────────── */}
        {isQr && (
          <div className="pub-qr-banner">
            <span className="pub-qr-banner-icon">📲</span>
            <span>QRコードで受け取ったプロフィールです</span>
          </div>
        )}

        {/* ── ヘッダー ─────────────────────────────────────────────────── */}
        <div className="pub-header">
          <div className="pub-avatar">
            <span>{(profile.patternName || "?")[0].toUpperCase()}</span>
          </div>
          <div className="pub-header-info">
            <h1 className="pub-name">{profile.patternName}</h1>
            {profile.audience && (
              <span className="pub-audience">{profile.audience}</span>
            )}
            {profile.handle && (
              <p className="pub-handle">@{profile.handle}</p>
            )}
          </div>
        </div>

        {/* ── 自己紹介 ─────────────────────────────────────────────────── */}
        {profile.description && (
          <p className="pub-description">{profile.description}</p>
        )}

        {/* ── フィールド ────────────────────────────────────────────────── */}
        {visibleFields.length > 0 && (
          <div className="pub-fields">
            {visibleFields.map((field) => (
              <div key={field.id} className="pub-field">
                <span className="pub-field-label">{field.label}</span>
                <span className="pub-field-value">{field.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── リンク ───────────────────────────────────────────────────── */}
        {visibleLinks.length > 0 && (
          <div className="pub-links">
            {visibleLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                className="pub-link"
              >
                <span className="pub-link-icon">{LINK_ICONS[link.type] ?? "🔗"}</span>
                <span>{link.label || link.type}</span>
              </a>
            ))}
          </div>
        )}

        {/* ── 交換ボタン（ログイン済みのみ） ───────────────────────────── */}
        {session.status === "user" && (
          <div className="pub-exchange-area">
            {exchanged ? (
              <div className="pub-exchange-done">
                <p>✓ {isQr ? "QRで交換記録しました" : "交換帳に追加しました"}</p>
                <Link href="/book" className="button secondary">
                  交換帳を見る →
                </Link>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="button"
                  style={{ width: "100%", minHeight: "48px", fontSize: "15px" }}
                  onClick={() => void handleExchange()}
                  disabled={exchangeBusy}
                >
                  {exchangeBusy ? "記録中..." : isQr ? "📒 交換帳に記録する" : "この人を交換帳に追加"}
                </button>
                {exchangeError && (
                  <p className="error-text" style={{ marginTop: "8px" }}>{exchangeError}</p>
                )}
              </>
            )}
          </div>
        )}

        {/* ── フッター ─────────────────────────────────────────────────── */}
        <div className="pub-footer">
          <Link href="/" className="pub-footer-link">
            Memoriaで自分のプロフ帳を作る →
          </Link>
        </div>

      </div>

      {/* ── ログイン促進モーダル（ゲスト向け・閉じられる） ─────────────── */}
      {loginModalOpen && (
        <div
          className="auth-prompt-backdrop"
          onClick={() => setLoginModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="ログインのご案内"
        >
          <div
            className="auth-prompt-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 閉じるボタン */}
            <button
              type="button"
              className="auth-prompt-close"
              onClick={() => setLoginModalOpen(false)}
              aria-label="閉じる"
            >
              ×
            </button>

            {/* アイコン＋メッセージ */}
            <div className="auth-prompt-icon">📒</div>
            <h2 className="auth-prompt-title">
              交換したプロフィールを<br />あとで見返せます
            </h2>
            <p className="auth-prompt-body">
              ログインすると、QRコードやリンクで受け取ったプロフィールを
              交換帳に記録して、いつでも振り返ることができます。
            </p>

            {/* CTAボタン */}
            <div className="auth-prompt-actions">
              <Link href={loginUrl} className="button auth-prompt-btn-login">
                ログインする
              </Link>
              <Link href={registerUrl} className="button secondary auth-prompt-btn-register">
                新規登録（無料）
              </Link>
            </div>

            {/* 閉じるリンク */}
            <button
              type="button"
              className="auth-prompt-skip"
              onClick={() => setLoginModalOpen(false)}
            >
              このまま閲覧する
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
