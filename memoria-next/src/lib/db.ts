import postgres from "postgres";
import { createHash, randomUUID } from "crypto";
import type { CustomSticker, Exchange, Profile, StickerGiftInboxItem, UserSettings } from "@/types";

// postgres.js の sql.json() は JSONValue 型を厳格に要求するが、
// カスタムインターフェース（Field, Link 等）はインデックスシグネチャがないため拒否される。
// 実行時は任意のシリアライズ可能な値を渡せるので unknown 経由でキャストして回避する。
type PgJsonValue = Parameters<postgres.Sql["json"]>[0];
const j = (v: unknown): PgJsonValue => v as PgJsonValue;

function hashStickerAsset(assetSrc: string): string {
  return createHash("sha256").update(assetSrc).digest("hex");
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function normalizeCustomStickers(input: unknown): CustomSticker[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((entry): CustomSticker | null => {
      if (!isObjectRecord(entry)) return null;
      const id = typeof entry.id === "string" && entry.id.length > 0 ? entry.id : randomUUID();
      const label = typeof entry.label === "string" && entry.label.length > 0 ? entry.label : "Custom";
      const assetSrc = typeof entry.assetSrc === "string" ? entry.assetSrc : "";
      if (!assetSrc) return null;
      const assetHash = typeof entry.assetHash === "string" && entry.assetHash.length > 0
        ? entry.assetHash
        : hashStickerAsset(assetSrc);
      return { id, label, assetSrc, assetHash };
    })
    .filter((entry): entry is CustomSticker => entry !== null);
}

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

// Google OAuth: email + google_id でユーザーを find-or-create する。
// 同じ email が既に存在する場合は google_id を紐づけて返す。
export async function findOrCreateGoogleUser(
  email: string,
  googleId: string
): Promise<{ id: string; email: string }> {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO memoria.users (email, google_id, is_guest)
    VALUES (${email}, ${googleId}, false)
    ON CONFLICT (email) DO UPDATE
      SET google_id = EXCLUDED.google_id
    RETURNING id, email
  `;
  return rows[0] as { id: string; email: string };
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

export async function findUserIdByHandle(handle: string): Promise<string | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT owner_id
    FROM memoria.profiles
    WHERE handle = ${handle}
    LIMIT 1
  `;
  return (rows[0]?.owner_id as string | undefined) ?? null;
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
  const data = isObjectRecord(row.data) ? row.data : {};
  return {
    plan: row.plan ?? "free",
    language: row.language ?? "ja",
    customStickers: normalizeCustomStickers(data.customStickers),
    groups: Array.isArray(data.groups) ? data.groups : [],
  };
}

export async function upsertSettings(userId: string, email: string, settings: UserSettings) {
  const sql = getSql();
  const normalizedCustomStickers = normalizeCustomStickers(settings.customStickers);
  const normalizedGroups = Array.isArray(settings.groups) ? settings.groups : [];
  await sql`
    INSERT INTO memoria.user_settings (user_id, email, plan, language, data)
    VALUES (
      ${userId}, ${email}, ${settings.plan}, ${settings.language},
      ${sql.json(j({ customStickers: normalizedCustomStickers, groups: normalizedGroups }))}
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan       = EXCLUDED.plan,
      language   = EXCLUDED.language,
      data       = EXCLUDED.data,
      updated_at = now()
  `;
}

export async function createStickerGift(
  senderUserId: string,
  recipientUserId: string,
  stickerLabel: string,
  stickerAssetSrc: string
): Promise<string | null> {
  const sql = getSql();
  const stickerAssetHash = hashStickerAsset(stickerAssetSrc);
  const rows = await sql`
    INSERT INTO memoria.sticker_gifts
      (sender_user_id, recipient_user_id, sticker_label, sticker_asset_src, sticker_asset_hash, status)
    VALUES
      (${senderUserId}, ${recipientUserId}, ${stickerLabel}, ${stickerAssetSrc}, ${stickerAssetHash}, 'pending')
    ON CONFLICT ON CONSTRAINT sticker_gifts_pending_unique DO NOTHING
    RETURNING id
  `;
  return (rows[0]?.id as string | undefined) ?? null;
}

export async function listPendingStickerGifts(recipientUserId: string): Promise<StickerGiftInboxItem[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      sg.id,
      sg.sticker_label,
      sg.sticker_asset_src,
      sg.created_at,
      sh.handle AS sender_handle
    FROM memoria.sticker_gifts sg
    LEFT JOIN LATERAL (
      SELECT p.handle
      FROM memoria.profiles p
      WHERE p.owner_id = sg.sender_user_id
        AND p.handle IS NOT NULL
      ORDER BY p.updated_at DESC NULLS LAST, p.created_at DESC
      LIMIT 1
    ) sh ON true
    WHERE sg.recipient_user_id = ${recipientUserId}
      AND sg.status = 'pending'
    ORDER BY sg.created_at DESC
  `;
  return rows.map((row) => ({
    id: row.id as string,
    senderHandle: (row.sender_handle as string | null) ?? null,
    stickerLabel: (row.sticker_label as string) ?? "Gift sticker",
    stickerAssetSrc: row.sticker_asset_src as string,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at ?? ""),
  }));
}

export async function acceptStickerGift(
  recipientUserId: string,
  recipientEmail: string,
  giftId: string
): Promise<{ status: "accepted"; added: boolean } | { status: "not_found" | "not_pending" }> {
  const sql = getSql();
  return sql.begin(async (tx) => {
    const giftRows = await tx`
      SELECT id, status, sticker_label, sticker_asset_src, sticker_asset_hash
      FROM memoria.sticker_gifts
      WHERE id = ${giftId}
        AND recipient_user_id = ${recipientUserId}
      LIMIT 1
      FOR UPDATE
    `;
    const gift = giftRows[0];
    if (!gift) return { status: "not_found" };
    if ((gift.status as string) !== "pending") return { status: "not_pending" };

    const settingsRows = await tx`
      SELECT plan, language, data
      FROM memoria.user_settings
      WHERE user_id = ${recipientUserId}
      LIMIT 1
      FOR UPDATE
    `;
    const current = settingsRows[0];
    const data = isObjectRecord(current?.data) ? current.data : {};
    const groups = Array.isArray(data.groups) ? data.groups : [];
    const customStickers = normalizeCustomStickers(data.customStickers);

    const assetSrc = gift.sticker_asset_src as string;
    const stickerHash = typeof gift.sticker_asset_hash === "string" && gift.sticker_asset_hash.length > 0
      ? gift.sticker_asset_hash
      : hashStickerAsset(assetSrc);

    const exists = customStickers.some((sticker) => {
      const existingHash = sticker.assetHash ?? hashStickerAsset(sticker.assetSrc);
      return existingHash === stickerHash;
    });

    if (!exists) {
      customStickers.unshift({
        id: randomUUID(),
        label: (gift.sticker_label as string) || "Gift sticker",
        assetSrc,
        assetHash: stickerHash,
      });
    }

    const nextPlan = (current?.plan as string) === "pro" ? "pro" : "free";
    const nextLanguage = (current?.language as string) === "en" ? "en" : "ja";

    if (current) {
      await tx`
        UPDATE memoria.user_settings
        SET
          plan = ${nextPlan},
          language = ${nextLanguage},
          data = ${tx.json(j({ customStickers, groups }))},
          updated_at = now()
        WHERE user_id = ${recipientUserId}
      `;
    } else {
      await tx`
        INSERT INTO memoria.user_settings (user_id, email, plan, language, data)
        VALUES (
          ${recipientUserId},
          ${recipientEmail},
          ${nextPlan},
          ${nextLanguage},
          ${tx.json(j({ customStickers, groups }))}
        )
      `;
    }

    await tx`
      UPDATE memoria.sticker_gifts
      SET
        status = 'accepted',
        accepted_at = now(),
        updated_at = now()
      WHERE id = ${giftId}
    `;

    return { status: "accepted", added: !exists };
  });
}

export async function rejectStickerGift(
  recipientUserId: string,
  giftId: string
): Promise<{ status: "rejected" } | { status: "not_found" | "not_pending" }> {
  const sql = getSql();
  return sql.begin(async (tx) => {
    const rows = await tx`
      SELECT id, status
      FROM memoria.sticker_gifts
      WHERE id = ${giftId}
        AND recipient_user_id = ${recipientUserId}
      LIMIT 1
      FOR UPDATE
    `;
    const gift = rows[0];
    if (!gift) return { status: "not_found" };
    if ((gift.status as string) !== "pending") return { status: "not_pending" };

    await tx`
      UPDATE memoria.sticker_gifts
      SET
        status = 'rejected',
        rejected_at = now(),
        updated_at = now()
      WHERE id = ${giftId}
    `;
    return { status: "rejected" };
  });
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
