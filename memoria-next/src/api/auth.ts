import { apiCall } from "./_client";
import type { User } from "@/types";

export const authApi = {
  /** 新規登録。成功時は自動ログイン済み（Cookie セット済み）*/
  register: (email: string, password: string) =>
    apiCall<User>("POST", "/auth/register", { email, password }),

  /** ログイン */
  login: (email: string, password: string) =>
    apiCall<User>("POST", "/auth/login", { email, password }),

  /** ゲストユーザー作成。DB に is_guest=true で登録し Cookie を発行する */
  startGuest: () =>
    apiCall<User>("POST", "/auth/guest"),

  /** ログアウト */
  logout: () =>
    apiCall<null>("POST", "/auth/logout"),

  /** 初期表示時のセッション確認。未ログインなら ok:false */
  me: () =>
    apiCall<User>("GET", "/auth/me"),
};
