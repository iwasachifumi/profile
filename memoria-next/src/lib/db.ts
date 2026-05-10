import postgres from "postgres";
import type { Exchange, Profile, UserSettings } from "@/types";

// postgres.js の sql.json() は JSONValue 型を厳格に要求するが、
// カスタムインターフェース（Field, Link 等）はインデックスシグネチャがないため拒否される。
// 実行時は任意のシリアライズ可能な値を渡せるので unknown 経由でキャストして回避する。
type PgJsonValue = Parameters<postgres.Sql["json"]>[0];
const j = (v: unknown): PgJsonValue => v as PgJsonValue;

const globalSql = global as typeof global & { _memoriaSql?: postgres.Sql };

// Lazy init so next build does not fail when DATABASE_URL is absent at import time.
export function getSql() {
  if (globalSql._memoriaSql) return globalSql._memoriaSql;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL が設定されていません");
  }

  const client = postgres(databaseUrl, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  globalSql._memoriaSql = client;
  return client;
}

export async function findUserByEmail(email: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT id, email, password_hash, created_at
    FROM memoria.users
    WHERE email = ${email}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function findUserById(id: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT id, email, created_at
    FROM memoria.users
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function createUser(email: string, passwordHash: string) {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO memoria.users (email, password_hash)
    VALUES (${email}, ${passwordHash})
    RETURNING id, email, is_guest, created_at
  `;
  return rows[0];
}

export async function createGuestUser() {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO memoria.users (is_guest)
    VALUES (true)
    RETURNING id, is_guest, created_at
  `;
  return rows[0];
}

export async function getProfilesByUser(userId: string): Promise<Profile[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM memoria.profiles
    WHERE owner_id = ${userId}
    ORDER BY created_at ASC
  `;
  return rows.map(rowToProfile);
}

export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM memoria.profiles
    WHERE public_slug = ${slug} AND is_public = true
    LIMIT 1
  `;
  return rows[0] ? rowToProfile(rows[0]) : null;
}

export async function getProfileByHandle(handle: string): Promise<Profile | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM memoria.profiles
    WHERE handle = ${handle} AND is_public = true
    LIMIT 1
  `;
  return rows[0] ? rowToProfile(rows[0]) : null;
}

export async function insertProfile(userId: string, profile: Profile) {
  const sql = getSql();
  await sql`
    INSERT INTO memoria.profiles
      (id, owner_id, public_slug, handle, is_public, pattern_name,
       audience, description, theme_id, frame_id, fields, links, stickers)
    VALUES
      (${profile.id}, ${userId}, ${profile.publicSlug}, ${profile.handle},
       ${profile.isPublic}, ${profile.patternName}, ${profile.audience},
       ${profile.description}, ${profile.themeId}, ${profile.frameId},
       ${sql.json(j(profile.fields))}, ${sql.json(j(profile.links))}, ${sql.json(j(profile.stickers))})
  `;
}

export async function updateProfile(userId: string, id: string, profile: Partial<Profile>) {
  const sql = getSql();
  await sql`
    UPDATE memoria.profiles SET
      public_slug  = COALESCE(${profile.publicSlug ?? null}, public_slug),
      handle       = COALESCE(${profile.handle ?? null}, handle),
      is_public    = COALESCE(${profile.isPublic ?? null}, is_public),
      pattern_name = COALESCE(${profile.patternName ?? null}, pattern_name),
      audience     = COALESCE(${profile.audience ?? null}, audience),
      description  = COALESCE(${profile.description ?? null}, description),
      theme_id     = COALESCE(${profile.themeId ?? null}, theme_id),
      frame_id     = COALESCE(${profile.frameId ?? null}, frame_id),
      fields       = COALESCE(${profile.fields ? sql.json(j(profile.fields)) : null}, fields),
      links        = COALESCE(${profile.links ? sql.json(j(profile.links)) : null}, links),
      stickers     = COALESCE(${profile.stickers ? sql.json(j(profile.stickers)) : null}, stickers),
      updated_at   = now()
    WHERE id = ${id} AND owner_id = ${userId}
  `;
}

export async function deleteProfile(userId: string, id: string) {
  const sql = getSql();
  await sql`
    DELETE FROM memoria.profiles WHERE id = ${id} AND owner_id = ${userId}
  `;
}

export async function getExchangesByUser(userId: string): Promise<Exchange[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM memoria.exchanges
    WHERE owner_id = ${userId}
    ORDER BY exchanged_at DESC
  `;
  return rows.map(rowToExchange);
}

export async function insertExchange(userId: string, exchange: Exchange) {
  const sql = getSql();
  await sql`
    INSERT INTO memoria.exchanges
      (id, owner_id, target_profile_id, method, event_name,
       exchanged_at, snapshot, private_note, tags)
    VALUES
      (${exchange.id}, ${userId}, ${exchange.targetProfileId},
       ${exchange.method}, ${exchange.eventName}, ${exchange.exchangedAt},
       ${sql.json(j(exchange.snapshot))}, ${exchange.privateNote},
       ${sql.json(j(exchange.tags))})
  `;
}

export async function updateExchange(userId: string, id: string, exchange: Partial<Exchange>) {
  const sql = getSql();
  await sql`
    UPDATE memoria.exchanges SET
      private_note = COALESCE(${exchange.privateNote ?? null}, private_note),
      tags         = COALESCE(${exchange.tags ? sql.json(j(exchange.tags)) : null}, tags),
      event_name   = COALESCE(${exchange.eventName ?? null}, event_name),
      updated_at   = now()
    WHERE id = ${id} AND owner_id = ${userId}
  `;
}

export async function deleteExchange(userId: string, id: string) {
  const sql = getSql();
  await sql`
    DELETE FROM memoria.exchanges WHERE id = ${id} AND owner_id = ${userId}
  `;
}

export async function getSettings(userId: string): Promise<UserSettings | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM memoria.user_settings WHERE user_id = ${userId} LIMIT 1
  `;
  if (!rows[0]) return null;
  const row = rows[0];
  return {
    plan: row.plan ?? "free",
    language: row.language ?? "ja",
    customStickers: row.data?.customStickers ?? [],
    groups: row.data?.groups ?? [],
  };
}

export async function upsertSettings(userId: string, email: string, settings: UserSettings) {
  const sql = getSql();
  await sql`
    INSERT INTO memoria.user_settings (user_id, email, plan, language, data)
    VALUES (
      ${userId}, ${email}, ${settings.plan}, ${settings.language},
      ${sql.json(j({ customStickers: settings.customStickers, groups: settings.groups }))}
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan       = EXCLUDED.plan,
      language   = EXCLUDED.language,
      data       = EXCLUDED.data,
      updated_at = now()
  `;
}

function rowToProfile(row: Record<string, unknown>): Profile {
  return {
    id: row.id as string,
    publicSlug: row.public_slug as string | null,
    handle: row.handle as string | null,
    isPublic: row.is_public as boolean,
    patternName: row.pattern_name as string,
    audience: (row.audience as string) ?? "",
    description: (row.description as string) ?? "",
    themeId: (row.theme_id as string) ?? "friends",
    frameId: (row.frame_id as string) ?? "none",
    fields: Array.isArray(row.fields) ? (row.fields as Profile["fields"]) : [],
    links: Array.isArray(row.links) ? (row.links as Profile["links"]) : [],
    stickers: Array.isArray(row.stickers) ? (row.stickers as Profile["stickers"]) : [],
  };
}

function rowToExchange(row: Record<string, unknown>): Exchange {
  return {
    id: row.id as string,
    targetProfileId: row.target_profile_id as string | null,
    method: (row.method as string) ?? "QR/URL",
    eventName: row.event_name as string | null,
    exchangedAt: row.exchanged_at as string,
    snapshot: (row.snapshot as Record<string, unknown>) ?? {},
    privateNote: (row.private_note as string) ?? "",
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
  };
}
