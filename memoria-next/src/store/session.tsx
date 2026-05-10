"use client";

// ログインセッションの管理。
// - 初期表示時に GET /api/auth/me で状態を確定する
// - 以降は login / logout 関数を呼ぶだけで全コンポーネントに伝播する

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { authApi } from "@/api/auth";
import type { User } from "@/types";

// ── 型 ───────────────────────────────────────────────────────────────────────

type SessionState =
  | { status: "loading" }
  | { status: "guest" }
  | { status: "user"; user: User };

interface SessionContext {
  session: SessionState;
  isGuestActive: boolean;                             // お試し利用中フラグ
  startGuest: () => Promise<string | null>;           // お試し利用開始（エラー時はメッセージを返す）
  login: (email: string, password: string) => Promise<string | null>;
  register: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const Ctx = createContext<SessionContext | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>({ status: "loading" });
  const [isGuestActive, setIsGuestActive] = useState(false);

  // 初期ロード: Cookie が有効か確認
  useEffect(() => {
    authApi.me().then((result) => {
      if (result.ok) {
        if (result.data.isGuest) {
          // ゲストセッションが残っている
          setSession({ status: "guest" });
          setIsGuestActive(true);
        } else {
          setSession({ status: "user", user: result.data });
        }
      } else {
        setSession({ status: "guest" });
        setIsGuestActive(false);
      }
    });
  }, []);

  const startGuest = useCallback(async (): Promise<string | null> => {
    const result = await authApi.startGuest();
    if (!result.ok) return result.error;
    setSession({ status: "guest" });
    setIsGuestActive(true);
    return null;
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const result = await authApi.login(email, password);
    if (!result.ok) return result.error;
    setIsGuestActive(false);
    setSession({ status: "user", user: result.data });
    return null;
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<string | null> => {
    const result = await authApi.register(email, password);
    if (!result.ok) return result.error;
    setIsGuestActive(false);
    setSession({ status: "user", user: result.data });
    return null;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setIsGuestActive(false);
    setSession({ status: "guest" });
  }, []);

  return (
    <Ctx.Provider value={{ session, isGuestActive, startGuest, login, register, logout }}>
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
