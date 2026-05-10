"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { profilesApi } from "@/api/profiles";
import AuthScreen from "@/features/auth/AuthScreen";
import { useSession } from "@/store/session";
import { useLang } from "@/store/language";
import type { Profile } from "@/types";

const THEMES = [
  { id: "default",  labelJa: "ナチュラル", labelEn: "Natural",  descJa: "温かみのある用紙",   descEn: "Warm natural paper" },
  { id: "business", labelJa: "ビジネス",   labelEn: "Business", descJa: "清潔感のある青系",   descEn: "Clean blue tones" },
  { id: "study",    labelJa: "スタディ",   labelEn: "Study",    descJa: "さわやかな緑系",     descEn: "Fresh green tones" },
  { id: "friends",  labelJa: "フレンズ",   labelEn: "Friends",  descJa: "明るいピンク系",     descEn: "Bright pink tones" },
];

const FRAMES = [
  { id: "none",          labelJa: "枠なし",       labelEn: "No frame" },
  { id: "top-ribbon",    labelJa: "リボン（上）",   labelEn: "Top ribbon" },
  { id: "corner-ribbon", labelJa: "コーナーリボン", labelEn: "Corner ribbon" },
  { id: "pink-stars",    labelJa: "ピンクスター",   labelEn: "Pink stars" },
];

export default function DesignScreen() {
  const { session } = useSession();
  const { t } = useLang();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = profiles.find((p) => p.id === selectedId) ?? null;

  const loadProfiles = useCallback(async () => {
    const result = await profilesApi.list();
    if (result.ok) {
      setProfiles(result.data);
      setSelectedId((cur) => cur ?? result.data[0]?.id ?? null);
    }
  }, []);

  useEffect(() => {
    if (session.status === "user") void loadProfiles();
  }, [loadProfiles, session.status]);

  async function handleSetTheme(themeId: string) {
    if (!selected || busy) return;
    setProfiles((ps) => ps.map((p) => (p.id === selected.id ? { ...p, themeId } : p)));
    setBusy(true);
    const result = await profilesApi.update(selected.id, { themeId });
    setBusy(false);
    if (!result.ok) setError(result.error);
  }

  async function handleSetFrame(frameId: string) {
    if (!selected || busy) return;
    setProfiles((ps) => ps.map((p) => (p.id === selected.id ? { ...p, frameId } : p)));
    setBusy(true);
    const result = await profilesApi.update(selected.id, { frameId });
    setBusy(false);
    if (!result.ok) setError(result.error);
  }

  if (session.status === "loading") {
    return <main className="app-shell"><p className="muted">{t("読み込み中...", "Loading...")}</p></main>;
  }
  if (session.status === "guest") {
    return <AuthScreen redirectOnAuth="/design" />;
  }

  return (
    <main className="app-shell">
      <section className="section-title">
        <div>
          <h1>{t("デザイン", "Design")}</h1>
          <p className="muted">{t("テーマと台紙を選んでください", "Choose a theme and frame")}</p>
        </div>
        <Link className="button secondary" href="/mine">{t("マイページへ", "Back to mine")}</Link>
      </section>

      {/* パターンタブ */}
      <section className="panel pad pattern-toolbar">
        <div className="profile-tabs" role="tablist">
          {profiles.length === 0 ? (
            <span className="muted small">{t("パターンがありません", "No patterns")}</span>
          ) : (
            profiles.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`profile-tab${selectedId === p.id ? " active" : ""}`}
                role="tab"
                onClick={() => setSelectedId(p.id)}
              >
                <strong>{p.patternName}</strong>
                <span>{p.audience || "—"}</span>
              </button>
            ))
          )}
        </div>
      </section>

      {selected && (
        <div className="stack">
          <section className="panel pad stack">
            {/* テーマ */}
            <h2 style={{ margin: 0 }}>{t("テーマ（用紙の色）", "Paper theme")}</h2>
            <div className="theme-grid">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  className={`theme-choice${selected.themeId === theme.id ? " active" : ""}`}
                  onClick={() => void handleSetTheme(theme.id)}
                  disabled={busy}
                >
                  <strong>{t(theme.labelJa, theme.labelEn)}</strong>
                  <span className="muted small">{t(theme.descJa, theme.descEn)}</span>
                </button>
              ))}
            </div>

            {/* フレーム */}
            <h2 style={{ margin: "4px 0 0" }}>{t("台紙（フレーム）", "Frame")}</h2>
            <div className="frame-grid">
              {FRAMES.map((frame) => (
                <button
                  key={frame.id}
                  type="button"
                  className={`frame-choice${selected.frameId === frame.id ? " active" : ""}`}
                  onClick={() => void handleSetFrame(frame.id)}
                  disabled={busy}
                >
                  <div className={`frame-thumb${frame.id === "none" ? " frame-thumb-none" : ""}`}>
                    {frame.id === "none" && (
                      <span>{t("枠なし", "No frame")}</span>
                    )}
                  </div>
                  <strong>{t(frame.labelJa, frame.labelEn)}</strong>
                </button>
              ))}
            </div>

            {error && <p className="error-text">{error}</p>}
            {busy && <p className="muted small">{t("保存中...", "Saving...")}</p>}
          </section>
        </div>
      )}
    </main>
  );
}
