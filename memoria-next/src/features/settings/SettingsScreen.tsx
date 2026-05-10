"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { settingsApi } from "@/api/settings";
import AuthScreen from "@/features/auth/AuthScreen";
import { useSession } from "@/store/session";
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
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [busy, setBusy] = useState<BusyKind>("load");
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    setBusy("load");
    setError(null);
    const result = await settingsApi.get();
    setBusy(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSettings(result.data);
  }, []);

  useEffect(() => {
    if (session.status !== "user") return;
    void loadSettings();
  }, [loadSettings, session.status]);

  async function handleSave() {
    setBusy("save");
    setError(null);
    const result = await settingsApi.update(settings);
    setBusy(null);
    if (!result.ok) {
      setError(result.error);
    }
  }

  if (session.status === "loading") {
    return (
      <main style={styles.page}>
        <p style={styles.muted}>Loading session...</p>
      </main>
    );
  }

  if (session.status === "guest") {
    return <AuthScreen redirectOnAuth="/settings" />;
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Settings</h1>
          <p style={styles.muted}>Account preferences</p>
        </div>
        <div style={styles.headerActions}>
          <Link href="/mine" style={styles.linkButton}>
            Mine
          </Link>
          <Link href="/guide" style={styles.linkButton}>
            Guide
          </Link>
          <button type="button" onClick={() => void logout()} style={styles.linkButton}>
            Sign out
          </button>
        </div>
      </header>

      <section style={styles.card}>
        {busy === "load" ? <p style={styles.muted}>Loading settings...</p> : null}

        <label style={styles.label}>
          Plan
          <select
            value={settings.plan}
            onChange={(e) =>
              setSettings((current) => ({ ...current, plan: e.target.value as "free" | "pro" }))
            }
            style={styles.input}
          >
            <option value="free">free</option>
            <option value="pro">pro</option>
          </select>
        </label>

        <label style={styles.label}>
          Language
          <select
            value={settings.language}
            onChange={(e) =>
              setSettings((current) => ({ ...current, language: e.target.value as "ja" | "en" }))
            }
            style={styles.input}
          >
            <option value="ja">ja</option>
            <option value="en">en</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={busy === "save"}
          style={styles.primaryButton}
        >
          {busy === "save" ? "Saving..." : "Save settings"}
        </button>

        {error ? <p style={styles.errorText}>{error}</p> : null}
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "20px",
    background: "linear-gradient(120deg, #f8fafc 0%, #e2e8f0 100%)",
    display: "grid",
    gap: "16px",
  },
  header: {
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  headerActions: {
    display: "flex",
    gap: "8px",
  },
  title: {
    margin: 0,
    fontSize: "24px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "14px",
    display: "grid",
    gap: "12px",
    alignContent: "start",
    maxWidth: "560px",
  },
  label: {
    display: "grid",
    gap: "6px",
    fontSize: "13px",
  },
  input: {
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "14px",
  },
  muted: {
    margin: 0,
    color: "#475569",
    fontSize: "13px",
  },
  primaryButton: {
    border: "1px solid #0f172a",
    borderRadius: "8px",
    background: "#0f172a",
    color: "#ffffff",
    padding: "8px 10px",
    cursor: "pointer",
    width: "fit-content",
  },
  linkButton: {
    border: "1px solid #475569",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#0f172a",
    padding: "8px 10px",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    margin: 0,
    color: "#b91c1c",
    fontSize: "13px",
  },
};
