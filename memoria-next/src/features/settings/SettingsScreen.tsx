"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { settingsApi } from "@/api/settings";
import { PLAN_LIMITS } from "@/config/planLimits";
import AuthScreen from "@/features/auth/AuthScreen";
import { useSession } from "@/store/session";
import { useLang } from "@/store/language";
import type { UserSettings } from "@/types";

type BusyKind = "load" | "save" | null;

const defaultSettings: UserSettings = {
  plan: "free",
  language: "ja",
  customStickers: [],
  groups: [],
};

export default function SettingsScreen() {
  const { session, logout } = useSession();
  const { t, setLanguage } = useLang();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [busy, setBusy]         = useState<BusyKind>("load");
  const [error, setError]       = useState<string | null>(null);
  const [saved, setSaved]       = useState(false);

  const loadSettings = useCallback(async () => {
    setBusy("load");
    setError(null);
    const result = await settingsApi.get();
    setBusy(null);
    if (!result.ok) { setError(result.error); return; }
    setSettings(result.data);
    setLanguage(result.data.language);
  }, [setLanguage]);

  useEffect(() => {
    if (session.status !== "user") return;
    void loadSettings();
  }, [loadSettings, session.status]);

  async function handleSave() {
    setBusy("save");
    setError(null);
    const result = await settingsApi.update(settings);
    setBusy(null);
    if (!result.ok) { setError(result.error); return; }
    setLanguage(settings.language);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (session.status === "loading") {
    return (
      <main className="app-shell">
        <p className="muted">{t("確認中...", "Loading...")}</p>
      </main>
    );
  }

  if (session.status === "guest") {
    return <AuthScreen redirectOnAuth="/settings" />;
  }

  const plan   = settings.plan;
  const limits = PLAN_LIMITS[plan];
  const email  = session.status === "user" ? session.user.email : undefined;

  return (
    <main className="app-shell" style={{ gap: "16px", maxWidth: "600px", margin: "0 auto", padding: "20px 16px" }}>

      {/* ヘッダー */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <h1 style={{ margin: 0, fontSize: "20px" }}>{t("設定", "Settings")}</h1>
        <Link href="/mine" className="button secondary" style={{ fontSize: "13px", padding: "4px 14px", minHeight: "auto" }}>
          {t("← マイページ", "← Mine")}
        </Link>
      </div>

      {error && <p className="error-text">{error}</p>}

      {busy === "load" ? (
        <p className="muted small">{t("設定を読み込み中...", "Loading settings...")}</p>
      ) : (
        <>
          {/* アカウント情報 */}
          <section className="panel pad" style={{ gap: "10px", display: "grid" }}>
            <h2 style={{ margin: 0, fontSize: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
              {t("アカウント", "Account")}
            </h2>
            {email && (
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span className="muted small" style={{ minWidth: "60px" }}>{t("メール", "Email")}</span>
                <span style={{ fontSize: "13px" }}>{email}</span>
              </div>
            )}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span className="muted small" style={{ minWidth: "60px" }}>{t("プラン", "Plan")}</span>
              <span style={{
                fontSize: "12px", fontWeight: 700, padding: "2px 10px", borderRadius: "99px",
                background: plan === "pro" ? "var(--green-soft)" : "var(--blue-soft)",
                color:      plan === "pro" ? "var(--green)"      : "var(--blue)",
              }}>
                {plan.toUpperCase()}
              </span>
            </div>
          </section>

          {/* プラン上限 */}
          <section className="panel pad" style={{ gap: "10px", display: "grid" }}>
            <h2 style={{ margin: 0, fontSize: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
              {t("ご利用上限", "Plan limits")}
            </h2>
            <div style={{ display: "grid", gap: "8px" }}>
              {[
                { label: t("パターン数", "Patterns"),           value: `${limits.patterns} 件` },
                { label: t("項目数 / パターン", "Fields / pattern"), value: `${limits.fieldsPerPattern} 件` },
                { label: t("グループ数", "Groups"),              value: `${limits.groups} 件` },
                { label: t("交換帳", "Exchanges"),               value: `${limits.exchanges} 件` },
                { label: t("カスタムシール", "Custom stickers"),  value: limits.customStickerUpload ? t("アップロード可", "Upload OK") : t("不可（Pro限定）", "Not available") },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "8px", fontSize: "13px" }}>
                  <span className="muted">{label}</span>
                  <span style={{ fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
            {plan !== "pro" && (
              <p className="muted small" style={{ margin: 0, borderTop: "1px solid var(--line)", paddingTop: "8px" }}>
                {t("Proにアップグレードすると上限が増え、カスタムシールが使えるようになります。", "Upgrade to Pro for higher limits and custom sticker upload.")}
              </p>
            )}
          </section>

          {/* 表示言語 */}
          <section className="panel pad" style={{ gap: "10px", display: "grid" }}>
            <h2 style={{ margin: 0, fontSize: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
              {t("表示言語", "Language")}
            </h2>
            <label style={{ display: "grid", gap: "6px", fontSize: "13px", color: "var(--muted)" }}>
              {t("言語を選択", "Select language")}
              <select
                value={settings.language}
                onChange={(e) =>
                  setSettings((cur) => ({ ...cur, language: e.target.value as "ja" | "en" }))
                }
              >
                <option value="ja">日本語</option>
                <option value="en">English</option>
              </select>
            </label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                type="button"
                className="button"
                onClick={() => void handleSave()}
                disabled={busy === "save"}
                style={{ minHeight: "36px", padding: "0 20px", fontSize: "14px" }}
              >
                {busy === "save" ? t("保存中...", "Saving...") : t("保存", "Save")}
              </button>
              {saved && <span className="muted small">✓ {t("保存しました", "Saved")}</span>}
            </div>
          </section>

          {/* アカウント操作 */}
          <section className="panel pad" style={{ gap: "8px", display: "grid" }}>
            <h2 style={{ margin: 0, fontSize: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
              {t("操作", "Actions")}
            </h2>
            <button
              type="button"
              className="button secondary"
              onClick={() => void logout()}
            >
              {t("ログアウト", "Sign out")}
            </button>
          </section>
        </>
      )}
    </main>
  );
}
