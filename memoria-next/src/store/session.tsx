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
  isGuestActive: boolean;           // お試し利用中フラグ
  startGuest: () => void;           // お試し利用開始
  login: (email: string, password: string) => Promise<string | null>;
  register: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const Ctx = createContext<SessionContext | null>(null);

const GUEST_KEY = "memoria_guest_active";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>({ status: "loading" });
  const [isGuestActive, setIsGuestActive] = useState(false);

  // 初期ロード: Cookie が有効か確認。未ログインならゲスト継続フラグを見る
  useEffect(() => {
    authApi.me().then((result) => {
      if (result.ok) {
        setSession({ status: "user", user: result.data });
        localStorage.removeItem(GUEST_KEY);
      } else {
        setSession({ status: "guest" });
        setIsGuestActive(localStorage.getItem(GUEST_KEY) === "1");
      }
    });
  }, []);

  const startGuest = useCallback(() => {
    localStorage.setItem(GUEST_KEY, "1");
    setIsGuestActive(true);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const result = await authApi.login(email, password);
    if (!result.ok) return result.error;
    localStorage.removeItem(GUEST_KEY);
    setIsGuestActive(false);
    setSession({ status: "user", user: result.data });
    return null;
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<string | null> => {
    const result = await authApi.register(email, password);
    if (!result.ok) return result.error;
    localStorage.removeItem(GUEST_KEY);
    setIsGuestActive(false);
    setSession({ status: "user", user: result.data });
    return null;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    localStorage.removeItem(GUEST_KEY);
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
