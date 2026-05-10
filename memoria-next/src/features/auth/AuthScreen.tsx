"use client";

import type { CSSProperties, FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/store/session";
import { useUi } from "@/store/ui";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type BusyKind = "login" | "register" | "logout" | null;

interface AuthScreenProps {
  redirectOnAuth?: string;
}

export default function AuthScreen({ redirectOnAuth }: AuthScreenProps) {
  const router = useRouter();
  const { session, login, register, logout } = useSession();
  const { ui, dispatch } = useUi();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<BusyKind>(null);

  useEffect(() => {
    if (!redirectOnAuth) return;
    if (session.status !== "user") return;
    router.replace(redirectOnAuth);
  }, [redirectOnAuth, router, session.status]);

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!loginEmail || !loginPassword) {
      setError("Please enter email and password.");
      return;
    }
    if (!isValidEmail(loginEmail)) {
      setError("Please enter a valid email.");
      return;
    }

    setBusy("login");
    const result = await login(loginEmail.trim(), loginPassword);
    setBusy(null);
    if (result) {
      setError(result);
      return;
    }
    if (redirectOnAuth) router.push(redirectOnAuth);
  }

  async function handleRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!registerEmail || !registerPassword || !registerPasswordConfirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (!isValidEmail(registerEmail)) {
      setError("Please enter a valid email.");
      return;
    }
    if (registerPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (registerPassword !== registerPasswordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    setBusy("register");
    const result = await register(registerEmail.trim(), registerPassword);
    setBusy(null);
    if (result) {
      setError(result);
      return;
    }
    if (redirectOnAuth) router.push(redirectOnAuth);
  }

  async function handleLogout() {
    setError(null);
    setBusy("logout");
    await logout();
    setBusy(null);
  }

  if (session.status === "loading") {
    return (
      <main style={styles.shell}>
        <section style={styles.card}>
          <h1 style={styles.title}>Memoria</h1>
          <p style={styles.muted}>Checking your session...</p>
        </section>
      </main>
    );
  }

  if (session.status === "user") {
    return (
      <main style={styles.shell}>
        <section style={styles.card}>
          <h1 style={styles.title}>Memoria</h1>
          <p style={styles.muted}>Signed in as {session.user.email}</p>
          {redirectOnAuth ? (
            <button
              type="button"
              onClick={() => router.push(redirectOnAuth)}
              style={styles.secondaryButton}
            >
              Continue
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={busy === "logout"}
            style={styles.primaryButton}
          >
            {busy === "logout" ? "Signing out..." : "Sign out"}
          </button>
        </section>
      </main>
    );
  }

  const isRegister = ui.authTab === "register";

  return (
    <main style={styles.shell}>
      <section style={styles.card}>
        <h1 style={styles.title}>Memoria</h1>
        <p style={styles.muted}>Sign in or create your account to continue.</p>

        <div style={styles.tabs} role="tablist" aria-label="auth mode">
          <button
            type="button"
            onClick={() => dispatch({ type: "SET_AUTH_TAB", payload: "login" })}
            style={isRegister ? styles.tabButton : styles.tabButtonActive}
            aria-pressed={!isRegister}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "SET_AUTH_TAB", payload: "register" })}
            style={isRegister ? styles.tabButtonActive : styles.tabButton}
            aria-pressed={isRegister}
          >
            Register
          </button>
        </div>

        {isRegister ? (
          <form onSubmit={handleRegisterSubmit} style={styles.form}>
            <label style={styles.label}>
              Email
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                autoComplete="email"
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Password
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                autoComplete="new-password"
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Confirm password
              <input
                type="password"
                value={registerPasswordConfirm}
                onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                autoComplete="new-password"
                style={styles.input}
              />
            </label>
            <button type="submit" disabled={busy === "register"} style={styles.primaryButton}>
              {busy === "register" ? "Creating..." : "Create account"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} style={styles.form}>
            <label style={styles.label}>
              Email
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="username"
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Password
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
                style={styles.input}
              />
            </label>
            <button type="submit" disabled={busy === "login"} style={styles.primaryButton}>
              {busy === "login" ? "Signing in..." : "Login"}
            </button>
          </form>
        )}

        {error ? <p style={styles.errorText}>{error}</p> : null}
      </section>
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
  title: {
    margin: 0,
    fontSize: "24px",
    lineHeight: 1.2,
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
  },
  tabButtonActive: {
    border: "1px solid #0f172a",
    borderRadius: "8px",
    background: "#0f172a",
    color: "#ffffff",
    padding: "8px 10px",
    cursor: "pointer",
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
  },
  primaryButton: {
    border: "1px solid #0f172a",
    borderRadius: "8px",
    background: "#0f172a",
    color: "#ffffff",
    padding: "10px 14px",
    fontSize: "14px",
    cursor: "pointer",
  },
  secondaryButton: {
    border: "1px solid #475569",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#0f172a",
    padding: "10px 14px",
    fontSize: "14px",
    cursor: "pointer",
  },
  errorText: {
    margin: 0,
    color: "#b91c1c",
    fontSize: "13px",
    lineHeight: 1.4,
  },
};
