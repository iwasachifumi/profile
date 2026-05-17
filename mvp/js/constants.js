export const STORAGE_KEY = "memoria-mvp-state-v1";
// AUTH_USERS_KEY: 旧 localStorage 認証で使用していたキー(削除済み)。
// Supabase Auth に移行後は不要。残骸データが端末に残っている場合があるが、
// アクセスしないので副作用なし。
export const AUTH_SESSION_KEY = "memoria-mvp-auth-session-v1";
export const AUTH_PREFS_KEY = "memoria-mvp-prefs-v1";
export const USER_STATE_KEY_PREFIX = `${STORAGE_KEY}:user:`;
export const GUEST_STATE_KEY = `${STORAGE_KEY}:guest`;
export const PROFILE_BASE_URL = "https://profile.ac7.co.jp/p/";
export const PLAN_LIMITS = {
  free: {
    patterns: 2,
    groups: 10,
    fields: 100,
    exchanges: 100
  },
  pro: {
    patterns: 10,
    groups: 50,
    fields: 200,
    exchanges: Number.POSITIVE_INFINITY
  }
};
export const LANGUAGES = ["ja", "en"];
