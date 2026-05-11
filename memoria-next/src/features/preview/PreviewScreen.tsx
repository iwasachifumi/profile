"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { profilesApi } from "@/api/profiles";
import AuthScreen from "@/features/auth/AuthScreen";
import { useSession } from "@/store/session";
import { useLang } from "@/store/language";
import type { Profile } from "@/types";

interface PreviewScreenProps {
  id: string;
}

export default function PreviewScreen({ id }: PreviewScreenProps) {
  const { session } = useSession();
  const { t } = useLang();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session.status !== "user") return;
    void (async () => {
      setLoading(true);
      const res = await profilesApi.getById(id);
      setLoading(false);
      if (!res.ok) { setError(res.error); return; }
      setProfile(res.data);
    })();
  }, [id, session.status]);

  if (session.status === "loading") {
    return <main className="app-shell"><p className="muted">{t("読み込み中...", "Loading...")}</p></main>;
  }
  if (session.status === "guest") {
    return <AuthScreen redirectOnAuth={`/preview/${id}`} />;
  }

  return (
    <main className="app-shell">
      <section className="section-title">
        <div>
          <h1>{t("プレビュー", "Preview")}</h1>
          <p className="muted">{t("自分だけが見られる確認用ページです", "Only you can see this preview")}</p>
        </div>
        <Link className="button secondary" href="/mine">{t("マイページへ", "Back to mine")}</Link>
      </section>

      {loading && <p className="muted">{t("読み込み中...", "Loading...")}</p>}
      {error && <p className="error-text">{error}</p>}

      {profile && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div
            className={`profile-paper theme-${profile.themeId || "default"}`}
            style={{ maxWidth: "480px", width: "100%", userSelect: "none" }}
          >
            <div className="paper-lines" />

            {/* 貼られたシール */}
            {profile.stickers.map((s) => {
              const sz = Math.round(80 * (s.scale ?? 1));
              return (
                <div
                  key={s.id}
                  style={{
                    position: "absolute",
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: `${sz}px`,
                    pointerEvents: "none",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/stamp/${s.stickerId}`}
                    alt=""
                    style={{ width: "100%", display: "block" }}
                  />
                </div>
              );
            })}

            {/* フレーム */}
            {profile.frameId && profile.frameId !== "none" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/frame/${profile.frameId}`}
                alt=""
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
            )}

            {/* プロフィール内容 */}
            <div className="profile-content">
              <header className="profile-head">
                <div className="avatar">
                  <span>{(profile.patternName[0] ?? "M").toUpperCase()}</span>
                </div>
                <div>
                  <p className="muted">{profile.patternName} / {profile.audience}</p>
                  <h2 className="profile-name">{profile.description || profile.patternName}</h2>
                </div>
              </header>

              {profile.fields.filter((f) => f.visible && f.value).map((f) => (
                <div key={f.id} className="answer">
                  <span className="muted small">{f.label}</span>
                  <strong>{f.value}</strong>
                </div>
              ))}

              {profile.links.filter((l) => l.visible && l.url).map((l) => (
                <div key={l.id} className="answer">
                  <span className="muted small">{l.label || l.type}</span>
                  <a href={l.url} target="_blank" rel="noreferrer" style={{ fontSize: "14px" }}>
                    {l.url.replace(/^https?:\/\//, "").slice(0, 50)}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="row">
            <Link className="button secondary" href="/design">{t("デザイン変更", "Edit design")}</Link>
            <Link className="button secondary" href="/stickers">{t("シール編集", "Edit stickers")}</Link>
          </div>
        </div>
      )}
    </main>
  );
}
