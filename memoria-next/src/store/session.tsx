"use client";

// ログインセッションの管理。
// - status: "loading" → 初期確認中
// - status: "guest"   → 未ログイン（Cookie なし）
// - status: "user"    → ログイン済み。user.isGuest=true ならゲストセッション

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { authApi } from "@/api/auth";
import type { User } from "@/types";
import type { Lang } from "@/store/language";

/** register() がこの値を返したとき「確認メール送信済み」を示す */
export const VERIFY_EMAIL_SENT = "__VERIFY_EMAIL_SENT__";

// ── 型 ───────────────────────────────────────────────────────────────────────

type SessionState =
  | { status: "loading" }
  | { status: "guest" }                   // 未ログイン（Cookie なし）
  | { status: "user"; user: User };       // ログイン済み（is_guest 含む）

interface SessionContext {
  session: SessionState;
  startGuest: () => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  register: (email: string, password: string, lang?: Lang) => Promise<string | null>;
  logout: () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const Ctx = createContext<SessionContext | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>({ status: "loading" });

  // 初期ロード: Cookie が有効か確認
  useEffect(() => {
    authApi.me().then((result) => {
      if (result.ok) {
        setSession({ status: "user", user: result.data });
      } else {
        setSession({ status: "guest" });
      }
    });
  }, []);

  // ゲストセッションを DB に作成して Cookie を受け取る
  const startGuest = useCallback(async (): Promise<string | null> => {
    const result = await authApi.startGuest();
    if (!result.ok) return result.error;
    setSession({ status: "user", user: result.data });
    return null;
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const result = await authApi.login(email, password);
    if (!result.ok) return result.error;
    setSession({ status: "user", user: result.data });
    return null;
  }, []);

  const register = useCallback(async (email: string, password: string, lang?: Lang): Promise<string | null> => {
    const result = await authApi.register(email, password, lang ?? "ja");
    if (!result.ok) return result.error;
    // 確認メール送信済み（セッションは発行しない）
    if (result.data.requiresVerification) return VERIFY_EMAIL_SENT;
    return null;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setSession({ status: "guest" });
  }, []);

  return (
    <Ctx.Provider value={{ session, startGuest, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useSession(): SessionContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSession は SessionProvider の内側で使ってください");
  return ctx;
}
