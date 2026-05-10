"use client";

import type { CSSProperties, FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/store/session";
import { useUi } from "@/store/ui";
import { useLang } from "@/store/language";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type BusyKind = "login" | "register" | "logout" | "guest" | null;

interface AuthScreenProps {
  redirectOnAuth?: string;
  redirectOnGuest?: string;
}

export default function AuthScreen({ redirectOnAuth, redirectOnGuest }: AuthScreenProps) {
  const router = useRouter();
  const { session, isGuestActive, startGuest, login, register, logout } = useSession();
  const { ui, dispatch } = useUi();
  const { lang, toggle, t } = useLang();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<BusyKind>(null);
  const [showGuestWarning, setShowGuestWarning] = useState(false);

  useEffect(() => {
    if (session.status === "user" && redirectOnAuth) {
      router.replace(redirectOnAuth);
    }
    if (session.status === "guest" && isGuestActive && redirectOnGuest) {
      router.replace(redirectOnGuest);
    }
  }, [session.status, isGuestActive, redirectOnAuth, redirectOnGuest, router]);

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!loginEmail || !loginPassword) {
      setError(t("メールアドレスとパスワードを入力してください。", "Please enter email and password."));
      return;
    }
    if (!isValidEmail(loginEmail)) {
      setError(t("有効なメールアドレスを入力してください。", "Please enter a valid email."));
      return;
    }
    setBusy("login");
    const result = await login(loginEmail.trim(), loginPassword);
    setBusy(null);
    if (result) { setError(result); return; }
    if (redirectOnAuth) router.push(redirectOnAuth);
  }

  async function handleRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!registerEmail || !registerPassword || !registerPasswordConfirm) {
      setError(t("すべて入力してください。", "Please fill in all fields."));
      return;
    }
    if (!isValidEmail(registerEmail)) {
      setError(t("有効なメールアドレスを入力してください。", "Please enter a valid email."));
      return;
    }
    if (registerPassword.length < 8) {
      setError(t("パスワードは8文字以上にしてください。", "Password must be at least 8 characters."));
      return;
    }
    if (registerPassword !== registerPasswordConfirm) {
      setError(t("パスワードが一致しません。", "Passwords do not match."));
      return;
    }
    setBusy("register");
    const result = await register(registerEmail.trim(), registerPassword);
    setBusy(null);
    if (result) { setError(result); return; }
    if (redirectOnAuth) router.push(redirectOnAuth);
  }

  async function handleLogout() {
    setError(null);
    setBusy("logout");
    await logout();
    setBusy(null);
  }

  function handleStartGuest() {
    setShowGuestWarning(true);
  }

  async function handleGuestConfirm() {
    setBusy("guest");
    const guestErr = await startGuest();
    setBusy(null);
    setShowGuestWarning(false);
    if (guestErr) { setError(guestErr); return; }
    if (redirectOnGuest) router.push(redirectOnGuest);
  }

  // ── ローディング ──────────────────────────────────────────────────────────────
  if (session.status === "loading") {
    return (
      <main style={styles.shell}>
        <section style={styles.card}>
          <h1 style={styles.title}>Memoria</h1>
          <p style={styles.muted}>{t("確認中...", "Checking your session...")}</p>
        </section>
      </main>
    );
  }

  // ── ログイン済み ──────────────────────────────────────────────────────────────
  if (session.status === "user") {
    return (
      <main style={styles.shell}>
        <section style={styles.card}>
          <h1 style={styles.title}>Memoria</h1>
          <p style={styles.muted}>{session.user.email} {t("でログイン中", "signed in")}</p>
          {redirectOnAuth && (
            <button type="button" onClick={() => router.push(redirectOnAuth)} style={styles.primaryButton}>
              {t("続ける", "Continue")}
            </button>
          )}
          <button type="button" onClick={() => void handleLogout()} disabled={busy === "logout"} style={styles.secondaryButton}>
            {busy === "logout" ? t("ログアウト中...", "Signing out...") : t("ログアウト", "Sign out")}
          </button>
        </section>
      </main>
    );
  }

  const isRegister = ui.authTab === "register";

  // ── 認証フォーム ──────────────────────────────────────────────────────────────
  return (
    <main style={styles.shell}>
      <section style={styles.card}>

        {/* ヘッダー：タイトル＋言語切替 */}
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Memoria</h1>
          <button type="button" onClick={toggle} style={styles.langButton}>
            {lang === "ja" ? "EN" : "日本語"}
          </button>
        </div>

        <p style={styles.muted}>
          {t("サインインまたは新規登録してください。", "Sign in or create your account to continue.")}
        </p>

        {/* ログイン / 新規登録 タブ */}
        <div style={styles.tabs} role="tablist">
          <button
            type="button"
            onClick={() => { dispatch({ type: "SET_AUTH_TAB", payload: "login" }); setError(null); }}
            style={isRegister ? styles.tabButton : styles.tabButtonActive}
          >
            {t("ログイン", "Login")}
          </button>
          <button
            type="button"
            onClick={() => { dispatch({ type: "SET_AUTH_TAB", payload: "register" }); setError(null); }}
            style={isRegister ? styles.tabButtonActive : styles.tabButton}
          >
            {t("新規登録", "Register")}
          </button>
        </div>

        {/* フォーム */}
        {isRegister ? (
          <form onSubmit={handleRegisterSubmit} style={styles.form}>
            <label style={styles.label}>
              {t("メールアドレス", "Email")}
              <input type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)}
                autoComplete="email" style={styles.input} />
            </label>
            <label style={styles.label}>
              {t("パスワード", "Password")}
              <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)}
                autoComplete="new-password" style={styles.input} />
            </label>
            <label style={styles.label}>
              {t("パスワード（確認）", "Confirm password")}
              <input type="password" value={registerPasswordConfirm} onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                autoComplete="new-password" style={styles.input} />
            </label>
            <button type="submit" disabled={busy === "register"} style={styles.primaryButton}>
              {busy === "register" ? t("作成中...", "Creating...") : t("アカウントを作成", "Create account")}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} style={styles.form}>
            <label style={styles.label}>
              {t("メールアドレス", "Email")}
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="username" style={styles.input} />
            </label>
            <label style={styles.label}>
              {t("パスワード", "Password")}
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password" style={styles.input} />
            </label>
            <button type="submit" disabled={busy === "login"} style={styles.primaryButton}>
              {busy === "login" ? t("ログイン中...", "Signing in...") : t("ログイン", "Login")}
            </button>
          </form>
        )}

        {error && <p style={styles.errorText}>{error}</p>}

        {/* 区切り */}
        <div style={styles.divider}>
          <span style={styles.dividerText}>{t("または", "or")}</span>
        </div>

        {/* お試し利用 */}
        <button type="button" onClick={handleStartGuest} style={styles.guestButton}>
          {t("お試し利用（ゲスト）", "Try without account")}
        </button>
      </section>

      {/* ゲスト利用 警告モーダル */}
      {showGuestWarning && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h2 style={styles.modalTitle}>{t("お試し利用について", "About guest mode")}</h2>
            <p style={styles.modalBody}>
              {t(
                "メールアドレス、パスワードやGoogle認証などをしないとデータへのアクセスができなくなる恐れがありますので、お試しの後、継続して使う時は設定メニューよりユーザログイン情報の設定をするようお願いします。",
                "Without registering an email, password, or Google sign-in, you may lose access to your data. After trying the app, please set up your login credentials from the settings menu if you wish to continue using it."
              )}
            </p>
            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={() => setShowGuestWarning(false)}
                style={styles.secondaryButton}
                disabled={busy === "guest"}
              >
                {t("キャンセル", "Cancel")}
              </button>
              <button
                type="button"
                onClick={() => void handleGuestConfirm()}
                style={styles.primaryButton}
                disabled={busy === "guest"}
              >
                {busy === "guest"
                  ? t("作成中...", "Creating...")
                  : t("確認しました", "I understand")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  shell: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "24px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
    display: "grid",
    gap: "14px",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    lineHeight: 1.2,
  },
  langButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    background: "#f8fafc",
    color: "#475569",
    padding: "4px 10px",
    fontSize: "12px",
    cursor: "pointer",
  },
  muted: {
    margin: 0,
    color: "#475569",
    fontSize: "14px",
    lineHeight: 1.4,
  },
  tabs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  tabButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#334155",
    padding: "8px 10px",
    cursor: "pointer",
    fontSize: "14px",
  },
  tabButtonActive: {
    border: "1px solid #0f172a",
    borderRadius: "8px",
    background: "#0f172a",
    color: "#ffffff",
    padding: "8px 10px",
    cursor: "pointer",
    fontSize: "14px",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
  label: {
    display: "grid",
    gap: "6px",
    fontSize: "14px",
    color: "#0f172a",
  },
  input: {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  primaryButton: {
    border: "1px solid #0f172a",
    borderRadius: "8px",
    background: "#0f172a",
    color: "#ffffff",
    padding: "10px 14px",
    fontSize: "14px",
    cursor: "pointer",
    width: "100%",
  },
  secondaryButton: {
    border: "1px solid #475569",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#0f172a",
    padding: "10px 14px",
    fontSize: "14px",
    cursor: "pointer",
    width: "100%",
  },
  errorText: {
    margin: 0,
    color: "#b91c1c",
    fontSize: "13px",
    lineHeight: 1.4,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#94a3b8",
    fontSize: "12px",
  },
  dividerText: {
    flexShrink: 0,
    color: "#94a3b8",
    fontSize: "12px",
    margin: "0 auto",
  },
  guestButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "#f8fafc",
    color: "#475569",
    padding: "10px 14px",
    fontSize: "14px",
    cursor: "pointer",
    width: "100%",
  },
  guestNote: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "11px",
    textAlign: "center",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.5)",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    zIndex: 50,
  },
  modalCard: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "24px",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.16)",
    display: "grid",
    gap: "16px",
  },
  modalTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#0f172a",
  },
  modalBody: {
    margin: 0,
    fontSize: "14px",
    color: "#334155",
    lineHeight: 1.6,
  },
  modalActions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
};
