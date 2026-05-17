// データ層の薄ラッパ。Supabase 固有の型は外に出さず、
// アプリ側の state 形式(camelCase)と DB 行(snake_case)を相互変換する。
//
// 後で Supabase 以外の DB に切り替える場合、このファイルだけ書き直せば
// アプリ本体には影響しない、という建付け。

import { supabase } from "./supabase.js";

// ── 変換: pattern (state) ↔ profile (row) ─────────────────────────────────────

function patternToProfileRow(userId, pattern) {
  return {
    id: pattern.id,
    owner_id: userId,
    public_slug: pattern.publicSlug ?? null,
    handle: pattern.handle ?? null,
    is_public: pattern.isPublic ?? false,
    pattern_name: pattern.patternName ?? "",
    audience: pattern.audience ?? null,
    description: pattern.description ?? null,
    theme_id: pattern.themeId ?? null,
    frame_id: pattern.frameId ?? null,
    fields: pattern.fields ?? [],
    links: pattern.links ?? [],
    stickers: pattern.stickers ?? []
  };
}

function profileRowToPattern(row) {
  return {
    id: row.id,
    publicSlug: row.public_slug,
    handle: row.handle,
    isPublic: row.is_public,
    patternName: row.pattern_name,
    audience: row.audience ?? "",
    description: row.description ?? "",
    themeId: row.theme_id ?? "friends",
    frameId: row.frame_id ?? "none",
    fields: Array.isArray(row.fields) ? row.fields : [],
    links: Array.isArray(row.links) ? row.links : [],
    stickers: Array.isArray(row.stickers) ? row.stickers : []
  };
}

// ── 変換: exchange (state) ↔ exchanges row ───────────────────────────────────

function exchangeToRow(userId, ex) {
  return {
    id: ex.id,
    owner_id: userId,
    target_profile_id: ex.targetProfileId ?? null,
    method: ex.method ?? "QR/URL",
    event_name: ex.eventName ?? null,
    exchanged_at: ex.exchangedAt ?? new Date().toISOString(),
    snapshot: ex.snapshot ?? {},
    private_note: ex.privateNote ?? "",
    tags: Array.isArray(ex.tags) ? ex.tags : []
  };
}

function rowToExchange(row) {
  return {
    id: row.id,
    targetProfileId: row.target_profile_id,
    method: row.method,
    eventName: row.event_name,
    exchangedAt: row.exchanged_at,
    snapshot: row.snapshot ?? {},
    privateNote: row.private_note ?? "",
    tags: Array.isArray(row.tags) ? row.tags : []
  };
}

// ── 取得 ──────────────────────────────────────────────────────────────────────

// 起動時に呼ぶ。ユーザーの全データをまとめて取る。
export async function fetchAllForUser(userId) {
  const [profilesRes, exchangesRes, settingsRes] = await Promise.all([
    supabase.from("profiles")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: true }),
    supabase.from("exchanges")
      .select("*")
      .eq("owner_id", userId)
      .order("exchanged_at", { ascending: false }),
    supabase.from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()
  ]);

  const error = profilesRes.error || exchangesRes.error || settingsRes.error || null;
  return {
    profiles: (profilesRes.data ?? []).map(profileRowToPattern),
    exchanges: (exchangesRes.data ?? []).map(rowToExchange),
    settings: settingsRes.data ?? null,
    error
  };
}

// 公開プロフィール取得(他人が QR から飛んでくる先)。RLS の public_read ポリシーで通る。
export async function fetchPublicProfileBySlug(slug) {
  const { data, error } = await supabase.from("profiles")
    .select("*")
    .eq("public_slug", slug)
    .eq("is_public", true)
    .maybeSingle();
  if (error) return { error };
  return { profile: data ? profileRowToPattern(data) : null };
}

export async function fetchPublicProfileByHandle(handle) {
  const { data, error } = await supabase.from("profiles")
    .select("*")
    .eq("handle", handle)
    .eq("is_public", true)
    .maybeSingle();
  if (error) return { error };
  return { profile: data ? profileRowToPattern(data) : null };
}

// ── 個別 upsert / delete ──────────────────────────────────────────────────────

export async function upsertProfile(userId, pattern) {
  const { error } = await supabase.from("profiles").upsert(patternToProfileRow(userId, pattern));
  return { error };
}

export async function deleteProfile(profileId) {
  const { error } = await supabase.from("profiles").delete().eq("id", profileId);
  return { error };
}

export async function upsertExchange(userId, exchange) {
  const { error } = await supabase.from("exchanges").upsert(exchangeToRow(userId, exchange));
  return { error };
}

export async function deleteExchange(exchangeId) {
  const { error } = await supabase.from("exchanges").delete().eq("id", exchangeId);
  return { error };
}

export async function upsertUserSettings(userId, email, settings) {
  const { error } = await supabase.from("user_settings").upsert({
    user_id: userId,
    email: email ?? null,
    plan: settings.plan ?? "free",
    language: settings.language ?? "ja",
    data: settings.data ?? {}
  });
  return { error };
}

// ── 一括 upsert(saveState の debounce 同期用)────────────────────────────────
// state 全体を Supabase に押し込む。削除は表現できない(個別に deleteProfile/Exchange)。

export async function syncStateToSupabase(userId, email, state) {
  const profileRows = (state.patterns ?? []).map((pattern) => patternToProfileRow(userId, pattern));
  const settingsRow = {
    user_id: userId,
    email: email ?? null,
    plan: state.plan ?? "free",
    language: state.language ?? "ja",
    data: {
      customStickers: state.customStickers ?? [],
      groups: state.groups ?? []
    }
  };

  const tasks = [supabase.from("user_settings").upsert(settingsRow)];
  if (profileRows.length) tasks.push(supabase.from("profiles").upsert(profileRows));

  const results = await Promise.all(tasks);
  const error = results.find((r) => r && r.error)?.error || null;
  return { error };
}
