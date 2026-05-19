"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPaperThemeCssVars } from "@/config/paperThemes";
import { profilesApi } from "@/api/profiles";
import AuthScreen from "@/features/auth/AuthScreen";
import { useSession } from "@/store/session";
import { useLang } from "@/store/language";
import type { Profile } from "@/types";

interface PreviewScreenProps {
  id: string;
}

function cloneProfile(profile: Profile): Profile {
  return { ...profile, fields: [...profile.fields], links: [...profile.links], stickers: [...profile.stickers] };
}

function resolveStickerSrc(stickerId: string) {
  return stickerId.startsWith("data:") ? stickerId : `/stamp/${stickerId}`;
}

export default function PreviewScreen({ id }: PreviewScreenProps) {
  const { session } = useSession();
  const { t } = useLang();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [draft, setDraft] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
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
      setDraft(cloneProfile(res.data));
      setEditing(false);
      setSaveNotice(null);
    })();
  }, [id, session.status]);

  async function handleSaveDraft() {
    if (!draft) return;
    setSaving(true);
    setSaveNotice(null);
    const result = await profilesApi.update(id, { fields: draft.fields });
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setProfile(cloneProfile(draft));
    setEditing(false);
    setSaveNotice(t("保存しました", "Saved"));
  }

  const activeProfile = draft ?? profile;

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
        <Link className="button secondary" href="/mine">{t("Myプロフへ", "Back")}</Link>
      </section>

      {loading && <p className="muted">{t("読み込み中...", "Loading...")}</p>}
      {error && <p className="error-text">{error}</p>}

      {activeProfile && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div className="row" style={{ width: "100%", maxWidth: "480px", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                if (editing && profile) setDraft(cloneProfile(profile));
                setEditing((prev) => !prev);
                setError(null);
              }}
            >
              {editing ? t("編集をやめる", "Cancel edit") : t("文字を編集", "Edit text")}
            </button>
            {editing && (
              <button type="button" className="button" onClick={() => void handleSaveDraft()} disabled={saving}>
                {saving ? t("保存中...", "Saving...") : t("保存", "Save")}
              </button>
            )}
          </div>

          <div
            className={`profile-paper theme-${activeProfile.themeId || "default"}${activeProfile.frameId && activeProfile.frameId !== "none" ? " has-image-frame" : ""}`}
            style={{
              maxWidth: "480px", width: "100%", userSelect: "none",
              ...getPaperThemeCssVars(activeProfile.themeId),
              ...(activeProfile.frameId && activeProfile.frameId !== "none"
                ? { "--frame-url": `url('/frame/${activeProfile.frameId}')` } as React.CSSProperties
                : {}),
            }}
          >
            <div className="paper-lines" />

            {/* 貼られたシール */}
            {activeProfile.stickers.map((s) => {
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
                  const nameField = activeProfile.fields.find((f) => f.label === "名前")?.value ?? "";
                  const displayName = nameField || activeProfile.description;
                  const initial = (nameField || activeProfile.patternName)[0]?.toUpperCase() ?? "M";
                  return (
                    <>
                      <div className="avatar">
                        <span>{initial}</span>
                      </div>
                      <div>
                        {activeProfile.audience
                          ? <p className="muted">{activeProfile.patternName} / {activeProfile.audience}</p>
                          : <p className="muted">{activeProfile.patternName}</p>
                        }
                        {displayName && <h2 className="profile-name">{displayName}</h2>}
                      </div>
                    </>
                  );
                })()}
              </header>

              {activeProfile.fields.filter((f) => f.visible && f.value).map((f) => (
                <div key={f.id} className="answer">
                  <span className="muted small">{f.label}</span>
                  <strong>{f.value}</strong>
                </div>
              ))}

              {activeProfile.links.filter((l) => l.visible && l.url).map((l) => (
                <div key={l.id} className="answer">
                  <span className="muted small">{l.label || l.type}</span>
                  <a href={l.url} target="_blank" rel="noreferrer" style={{ fontSize: "14px" }}>
                    {l.url.replace(/^https?:\/\//, "").slice(0, 50)}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {editing && draft && (
            <section className="panel pad" style={{ width: "100%", maxWidth: "480px", display: "grid", gap: "10px" }}>
              <h2 style={{ margin: 0, fontSize: "14px" }}>{t("プレビューで文字を編集", "Edit text in preview")}</h2>
              <div style={{ display: "grid", gap: "8px" }}>
                {draft.fields.filter((field) => field.visible).map((field) => (
                  <label key={field.id} style={{ display: "grid", gap: "4px", fontSize: "12px", color: "var(--muted)" }}>
                    {field.label}
                    <input
                      value={field.value}
                      onChange={(e) =>
                        setDraft((prev) => prev
                          ? { ...prev, fields: prev.fields.map((f) => f.id === field.id ? { ...f, value: e.target.value } : f) }
                          : prev)
                      }
                    />
                  </label>
                ))}
              </div>
            </section>
          )}

          {saveNotice && <p className="muted small">{saveNotice}</p>}

          <div className="row">
            <Link className="button secondary" href="/design">{t("デザイン変更", "Edit design")}</Link>
            <Link className="button secondary" href="/stickers">{t("シール編集", "Edit stickers")}</Link>
          </div>
        </div>
      )}
    </main>
  );
}
