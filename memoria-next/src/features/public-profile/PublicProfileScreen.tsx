"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { publicApi } from "@/api/public";
import { exchangesApi } from "@/api/exchanges";
import { useSession } from "@/store/session";
import type { Profile } from "@/types";

interface PublicProfileScreenProps {
  slug?: string;
  handle?: string;
}

const LINK_ICONS: Record<string, string> = {
  x:         "𝕏",
  instagram: "📷",
  github:    "🐙",
  linkedin:  "💼",
  website:   "🔗",
  other:     "🔗",
};

export default function PublicProfileScreen({ slug, handle }: PublicProfileScreenProps) {
  const hasIdentifier = Boolean(slug || handle);
  const { session } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(hasIdentifier);
  const [error, setError] = useState<string | null>(
    hasIdentifier ? null : "プロフィールが見つかりません。"
  );
  const [exchanged, setExchanged] = useState(false);
  const [exchangeBusy, setExchangeBusy] = useState(false);
  const [exchangeError, setExchangeError] = useState<string | null>(null);

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

  // ── 交換する ──────────────────────────────────────────────────────────────

  async function handleExchange() {
    if (!profile) return;

    if (session.status === "loading") return;

    if (session.status === "guest") {
      const returnPath = slug
        ? `/profile/${slug}`
        : `/profile/handle/${handle}`;
      router.push(`/?return=${encodeURIComponent(returnPath)}`);
      return;
    }

    setExchangeBusy(true);
    setExchangeError(null);

    const result = await exchangesApi.create({
      id: crypto.randomUUID(),
      targetProfileId: profile.id,
      method: "qr",
      eventName: null,
      exchangedAt: new Date().toISOString(),
      snapshot: {
        patternName: profile.patternName,
        audience: profile.audience,
        description: profile.description,
        handle: profile.handle,
        slug: profile.publicSlug,
      },
      privateNote: "",
      tags: [],
    });

    setExchangeBusy(false);
    if (!result.ok) { setExchangeError(result.error); return; }
    setExchanged(true);
  }

  // ── ローディング / エラー ─────────────────────────────────────────────────

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

        {/* ── 交換ボタン ────────────────────────────────────────────────── */}
        <div className="pub-exchange-area">
          {exchanged ? (
            <div className="pub-exchange-done">
              <p>✓ 交換帳に追加しました</p>
              <Link href="/book" className="button secondary">
                交換帳を見る
              </Link>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="button lp-btn-main"
                style={{ width: "100%" }}
                onClick={() => void handleExchange()}
                disabled={exchangeBusy || session.status === "loading"}
              >
                {exchangeBusy
                  ? "追加中..."
                  : session.status === "guest"
                  ? "ログインして交換帳に追加"
                  : "この人を交換帳に追加"}
              </button>
              {exchangeError && (
                <p className="error-text" style={{ marginTop: "8px" }}>{exchangeError}</p>
              )}
              {session.status === "guest" && (
                <p className="muted small" style={{ textAlign: "center", marginTop: "6px" }}>
                  アカウント不要で閲覧できます。交換帳への追加はログインが必要です。
                </p>
              )}
            </>
          )}
        </div>

        {/* ── フッター ─────────────────────────────────────────────────── */}
        <div className="pub-footer">
          <Link href="/" className="pub-footer-link">
            Memoriaで自分のプロフ帳を作る →
          </Link>
        </div>

      </div>
    </main>
  );
}
