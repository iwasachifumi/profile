// 認証の薄ラッパー。Supabase 固有の型(User / Session / AuthError 等)は
// この境界の外に漏らさない。返り値は常にプレーンオブジェクト:
//   - 成功: { user: { id, email, lastLoginAt } }
//   - 失敗: { error: { code, message } }
// onAuthChange は (user|null) を渡すだけ。
//
// 後で Auth.js / Lucia 等に差し替える場合、このファイルを再実装すれば
// アプリ本体は触らずに済む(という建付け)。

import { supabase } from "./supabase.js";

function toUser(supabaseUser) {
  if (!supabaseUser) return null;
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || "",
    lastLoginAt: supabaseUser.last_sign_in_at || ""
  };
}

function toError(error, fallbackCode = "auth_error") {
  if (!error) return null;
  return {
    code: error.code || error.name || fallbackCode,
    message: error.message || String(error)
  };
}

// ── 起動時 ────────────────────────────────────────────────────────────────────
// アプリ起動時に呼ぶ。永続化されたセッションがあれば user を返す。
export async function getInitialUser() {
  const { data, error } = await supabase.auth.getSession();
  if (error) return { user: null, error: toError(error) };
  return { user: toUser(data?.session?.user || null) };
}

// ── サインアップ ──────────────────────────────────────────────────────────────
export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: toError(error) };
  // メール確認が有効な場合 user は返るが session は null。
  // 開発初期は Supabase 側で「Confirm email」OFF を想定。ON のときは
  // session==null で「メール確認待ち」として扱う必要がある。
  return { user: toUser(data?.user || null), needsEmailConfirm: !data?.session };
}

// ── サインイン ────────────────────────────────────────────────────────────────
export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: toError(error) };
  return { user: toUser(data?.user || null) };
}

// ── サインアウト ──────────────────────────────────────────────────────────────
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) return { error: toError(error) };
  return { ok: true };
}

// ── 状態購読 ──────────────────────────────────────────────────────────────────
// callback には (user|null) が渡る。戻り値は unsubscribe 関数。
export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(toUser(session?.user || null));
  });
  return () => data?.subscription?.unsubscribe?.();
}
