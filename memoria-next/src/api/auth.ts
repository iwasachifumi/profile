import { apiCall } from "./_client";
import type { User } from "@/types";
import type { Lang } from "@/store/language";

export const authApi = {
  /** 新規登録。成功時は確認メールを送信（requiresVerification: true を返す） */
  register: (email: string, password: string, lang: Lang = "ja") =>
    apiCall<{ requiresVerification: boolean }>("POST", "/auth/register", { email, password, lang }),

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
