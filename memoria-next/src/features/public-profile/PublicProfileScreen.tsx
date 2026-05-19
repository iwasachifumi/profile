"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { getPaperThemeCssVars } from "@/config/paperThemes";
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

function resolveStickerSrc(stickerId: string) {
  return stickerId.startsWith("data:") ? stickerId : `/stamp/${stickerId}`;
}

function initialOf(name: string) {
  return (name || "?")[0].toUpperCase();
}

export default function PublicProfileScreen({ slug, handle, via }: PublicProfileScreenProps) {
  const hasIdentifier = Boolean(slug || handle);
  const isQr          = via === "qr";
  const { session, startGuest } = useSession();

  const [profile,       setProfile]       = useState<Profile | null>(null);
  const [loading,       setLoading]       = useState(hasIdentifier);
  const [error,         setError]         = useState<string | null>(
    hasIdentifier ? null : "プロフィールが見つかりません。"
  );
  const [exchanged,     setExchanged]     = useState(false);
  const [exchangeBusy,  setExchangeBusy]  = useState(false);
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const [authModal,     setAuthModal]     = useState(false);
  const [authBusy,      setAuthBusy]      = useState(false);
  const [authError,     setAuthError]     = useState<string | null>(null);

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

  // ── 交換記録 ────────────────────────────────────────────────────────────

  // 未ログイン時は認証選択モーダルを開く
  function handleExchangeClick() {
    if (!profile) return;
    if (session.status !== "user") { setAuthModal(true); return; }
    void doExchange();
  }

  async function doExchange() {
    if (!profile) return;
    setExchangeBusy(true);
    setExchangeError(null);
    const result = await exchangesApi.create({
      id:              crypto.randomUUID(),
      targetProfileId: profile.id,
      method:          isQr ? "qr" : "manual",
      eventName:       null,
      exchangedAt:     new Date().toISOString(),
      snapshot: {
        name:        profile.fields.find((f) => f.label === "名前")?.value || "",
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
    if (!result.ok) { setExchangeError(result.error ?? "記録できませんでした。もう一度お試しください。"); return; }
    setExchanged(true);
  }

  // ゲスト登録 → 即座に交換記録
  async function handleGuestAndExchange() {
    setAuthBusy(true);
    setAuthError(null);
    const err = await startGuest();
    if (err) { setAuthBusy(false); setAuthError("ゲスト登録に失敗しました。"); return; }
    setAuthModal(false);
    setAuthBusy(false);
    await doExchange();
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
  const hasFrame      = Boolean(profile.frameId && profile.frameId !== "none");

  const paperStyle: CSSProperties = {
    ...getPaperThemeCssVars(profile.themeId),
    ...(hasFrame ? { "--frame-url": `url('/frame/${profile.frameId}')` } : {}),
  } as CSSProperties;

  return (
    <main className="pub-page">
      <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "12px", padding: "16px 0 32px" }}>

        {/* ── QR経由バナー ─────────────────────────────────────────────── */}
        {isQr && (
          <div className="pub-qr-banner">
            <span className="pub-qr-banner-icon">📲</span>
            <span>QRコードで受け取ったプロフィールです</span>
          </div>
        )}

        {/* ── 交換ボタン（上部固定） ───────────────────────────────────── */}
        <div className="pub-card" style={{ borderRadius: "12px" }}>
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
                onClick={handleExchangeClick}
                disabled={exchangeBusy || session.status === "loading"}
              >
                {exchangeBusy ? "記録中..." : isQr ? "📒 交換帳に記録する" : "この人を交換帳に追加"}
              </button>
              {exchangeError && (
                <div style={{ marginTop: "8px" }}>
                  <p className="error-text" style={{ margin: 0 }}>{exchangeError}</p>
                  {exchangeError.includes("有効期限") && (
                    <Link
                      href={loginUrl}
                      className="button secondary"
                      style={{ display: "block", marginTop: "8px", textAlign: "center" }}
                    >
                      🔑 ログインし直す
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── プロフィールカード（デザイン適用） ─────────────────────── */}
        <div
          className={`profile-paper theme-${profile.themeId || "default"}${hasFrame ? " has-image-frame" : ""}`}
          style={paperStyle}
        >
          <div className="paper-lines" />

          {/* シール */}
          {profile.stickers.map((s) => {
            const sz = Math.round(80 * (s.scale ?? 1));
            return (
              <div
                key={s.id}
                style={{
                  position: "absolute",
                  left:  `${s.x}%`,
                  top:   `${s.y}%`,
                  width: `${sz}px`,
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveStickerSrc(s.stickerId)}
                  alt=""
                  style={{ width: "100%", display: "block" }}
                />
              </div>
            );
          })}

          {/* プロフィール内容 */}
          <div className="profile-content">
            <header className="profile-head">
              {(() => {
                const nameField = profile.fields.find((f) => f.label === "名前")?.value ?? "";
                const displayName = nameField || profile.description;
                const initial = initialOf(nameField || profile.patternName);
                return (
                  <>
                    <div className="avatar">
                      {profile.avatarSrc
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={profile.avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                        : <span>{initial}</span>
                      }
                    </div>
                    <div>
                      <p className="muted" style={{ margin: 0, fontSize: "13px" }}>
                        {profile.patternName}{profile.audience ? ` / ${profile.audience}` : ""}
                      </p>
                      {displayName && <h2 className="profile-name">{displayName}</h2>}
                    </div>
                  </>
                );
              })()}
            </header>

            {/* フィールド */}
            {visibleFields.map((field) => (
              <div key={field.id} className="answer">
                <span className="muted small">{field.label}</span>
                <strong>{field.value}</strong>
              </div>
            ))}

            {/* リンク */}
            {visibleLinks.length > 0 && (
              <div className="pub-links" style={{ marginTop: "8px" }}>
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
          </div>
        </div>

        {/* ── フッター ─────────────────────────────────────────────────── */}
        <div className="pub-footer" style={{ textAlign: "center", padding: "8px 0" }}>
          <Link href="/" className="pub-footer-link">
            Memoriaで自分のプロフ帳を作る →
          </Link>
        </div>

      </div>

      {/* ── 交換帳記録のための認証選択モーダル ─────────────────────────── */}
      {authModal && (
        <div
          className="auth-prompt-backdrop"
          onClick={() => { if (!authBusy) setAuthModal(false); }}
          role="dialog"
          aria-modal="true"
          aria-label="交換帳に記録する方法を選んでください"
        >
          <div className="auth-prompt-sheet" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="auth-prompt-close"
              onClick={() => setAuthModal(false)}
              disabled={authBusy}
              aria-label="閉じる"
            >
              ×
            </button>

            <div className="auth-prompt-icon">📒</div>
            <h2 className="auth-prompt-title">交換帳に記録する</h2>
            <p className="auth-prompt-body">
              記録方法を選んでください。
            </p>

            {authError && (
              <p className="error-text" style={{ marginBottom: "8px" }}>{authError}</p>
            )}

            <div className="auth-prompt-actions">
              <button
                type="button"
                className="button"
                onClick={() => void handleGuestAndExchange()}
                disabled={authBusy}
                style={{ width: "100%" }}
              >
                {authBusy ? "処理中..." : "📲 ゲスト登録で記録する"}
              </button>
              <Link href={loginUrl} className="button secondary auth-prompt-btn-login" style={{ textAlign: "center" }}>
                🔑 ログインして記録する
              </Link>
              <Link href={registerUrl} className="button secondary auth-prompt-btn-register" style={{ textAlign: "center" }}>
                ✉️ ユーザー登録して記録する
              </Link>
            </div>

            <button
              type="button"
              className="auth-prompt-skip"
              onClick={() => setAuthModal(false)}
              disabled={authBusy}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
