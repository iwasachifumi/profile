"use client";

import type { FormEvent } from "react";
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
  googleError?: string;
}

export default function AuthScreen({ redirectOnAuth, googleError }: AuthScreenProps) {
  const router = useRouter();
  const { session, startGuest, login, register, logout } = useSession();
  const { ui, dispatch } = useUi();
  const { t } = useLang();

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
  }, [session.status, redirectOnAuth, router]);

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
    if (redirectOnAuth) router.push(redirectOnAuth);
  }

  // ── ローディング ──────────────────────────────────────────────────────────────
  if (session.status === "loading") {
    return (
      <div className="auth-shell">
        <article className="panel pad auth-card stack">
          <p className="muted">{t("確認中...", "Checking your session...")}</p>
        </article>
      </div>
    );
  }

  // ── ログイン済み ──────────────────────────────────────────────────────────────
  if (session.status === "user") {
    const displayName = session.user.isGuest
      ? t("ゲスト", "Guest")
      : session.user.email;
    return (
      <div className="auth-shell">
        <article className="panel pad auth-card stack">
          <p className="muted">{displayName} {t("でログイン中", "signed in")}</p>
          {redirectOnAuth && (
            <button type="button" onClick={() => router.push(redirectOnAuth)}>
              {t("続ける", "Continue")}
            </button>
          )}
          <button
            type="button"
            className="secondary"
            onClick={() => void handleLogout()}
            disabled={busy === "logout"}
          >
            {busy === "logout" ? t("ログアウト中...", "Signing out...") : t("ログアウト", "Sign out")}
          </button>
        </article>
      </div>
    );
  }

  const isRegister = ui.authTab === "register";

  // ── 認証フォーム ──────────────────────────────────────────────────────────────
  return (
    <>
      <div className="auth-shell">
        <article className="panel pad auth-card stack">
          <div>
            <h1>{t("Memoriaをはじめる", "Start Memoria")}</h1>
            <p className="muted">
              {t(
                "メール登録で使い始めるか、登録せずにおためし利用できます。",
                "Sign up with email, or try first without registration."
              )}
            </p>
          </div>

          {/* ログイン / 新規登録 タブ */}
          <div className="auth-mode-tabs" role="tablist">
            <button
              type="button"
              className={`auth-mode-btn${isRegister ? " active" : ""}`}
              onClick={() => { dispatch({ type: "SET_AUTH_TAB", payload: "register" }); setError(null); }}
            >
              {t("新規登録", "Register")}
            </button>
            <button
              type="button"
              className={`auth-mode-btn${!isRegister ? " active" : ""}`}
              onClick={() => { dispatch({ type: "SET_AUTH_TAB", payload: "login" }); setError(null); }}
            >
              {t("ログイン", "Login")}
            </button>
          </div>

          {/* フォーム */}
          {isRegister ? (
            <form onSubmit={handleRegisterSubmit} className="auth-form stack">
              <label>
                {t("メールアドレス", "Email")}
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  autoComplete="email"
                />
              </label>
              <label>
                {t("パスワード", "Password")}
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </label>
              <label>
                {t("パスワード（確認）", "Confirm password")}
                <input
                  type="password"
                  value={registerPasswordConfirm}
                  onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                  autoComplete="new-password"
                />
              </label>
              <button type="submit" disabled={busy === "register"}>
                {busy === "register" ? t("作成中...", "Creating...") : t("アカウント作成", "Create account")}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="auth-form stack">
              <label>
                {t("メールアドレス", "Email")}
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  autoComplete="username"
                />
              </label>
              <label>
                {t("パスワード", "Password")}
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </label>
              <button type="submit" disabled={busy === "login"}>
                {busy === "login" ? t("ログイン中...", "Signing in...") : t("ログイン", "Login")}
              </button>
            </form>
          )}

          {error && <p className="error-text">{error}</p>}

          {/* Google ログイン */}
          <div className="auth-divider">
            <span>{t("または", "or")}</span>
          </div>

          {googleError && (
            <p className="error-text">
              {t("Googleログインに失敗しました。", "Google sign-in failed.")}{" "}
              <span className="muted small">({googleError})</span>
            </p>
          )}

          <a
            href={`/api/auth/google${redirectOnAuth ? `?return=${encodeURIComponent(redirectOnAuth)}` : ""}`}
            className="button google-btn"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
            </svg>
            {t("Googleでログイン", "Sign in with Google")}
          </a>

          {/* お試し利用 */}
          <div className="auth-guest stack">
            <strong>{t("登録せずに利用する", "Use without registration")}</strong>
            <p className="muted small">
              {t(
                "おためし利用では、この端末の現在セッションにのみデータが保存されます。",
                "Trial mode stores data only in this browser session on this device."
              )}
            </p>
            <button type="button" className="secondary" onClick={handleStartGuest}>
              {t("おためし開始", "Start trial")}
            </button>
          </div>
        </article>
      </div>

      {/* ゲスト利用 警告モーダル */}
      {showGuestWarning && (
        <div className="modal-backdrop">
          <div className="modal-dialog stack">
            <h2>{t("お試し利用について", "About guest mode")}</h2>
            <p className="muted">
              {t(
                "メールアドレス、パスワードやGoogle認証などをしないとデータへのアクセスができなくなる恐れがありますので、お試しの後、継続して使う時は設定メニューよりユーザログイン情報の設定をするようお願いします。",
                "Without registering an email, password, or Google sign-in, you may lose access to your data. After trying the app, please set up your login credentials from the settings menu if you wish to continue using it."
              )}
            </p>
            <div className="modal-actions" style={{ gap: "10px" }}>
              <button
                type="button"
                className="secondary"
                onClick={() => setShowGuestWarning(false)}
                disabled={busy === "guest"}
              >
                {t("キャンセル", "Cancel")}
              </button>
              <button
                type="button"
                onClick={() => void handleGuestConfirm()}
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
    </>
  );
}
