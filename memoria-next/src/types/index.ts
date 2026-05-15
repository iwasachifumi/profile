// ── アプリ全体で使う型 ────────────────────────────────────────────────────────
// DB の snake_case はここには出てこない。変換は src/lib/db.ts でだけ行う。

export interface User {
  id: string;
  email: string;
  isGuest: boolean;
  createdAt?: string;
}

export interface CardInfoItem {
  id:       string;
  label:    string;
  value:    string;
  color?:   string;   // CSS color string e.g. "#ffffff"
  fontSize?: number;  // px e.g. 14
}

export interface CardConfig {
  templateFile: string;
  items:        CardInfoItem[];
  cardStickers: StickerItem[];
}

export interface Profile {
  id: string;
  publicSlug: string | null;
  handle: string | null;
  isPublic: boolean;
  patternName: string;
  audience: string;
  description: string;
  themeId: string;
  frameId: string;
  avatarSrc: string | null;  // base64 data URL（最大512px正方形）
  cardConfig: CardConfig | null; // QRカードビルダーの作業状態
  fields: Field[];
  links: Link[];
  stickers: StickerItem[];
}

export interface Field {
  id: string;
  groupId: string;
  label: string;
  value: string;
  visible: boolean;
}

export interface Link {
  id: string;
  type: string;
  label: string;
  url: string;
  visible: boolean;
}

export interface StickerItem {
  id: string;
  stickerId: string;
  x: number;
  y: number;
  scale: number;
}

export interface Exchange {
  id: string;
  targetProfileId: string | null;
  method: string;
  eventName: string | null;
  exchangedAt: string;
  snapshot: Record<string, unknown>;
  privateNote: string;
  tags: string[];
}

export interface CustomSticker {
  id: string;
  label: string;
  assetSrc: string;
  assetHash?: string;
}

export interface StickerGiftInboxItem {
  id: string;
  senderHandle: string | null;
  stickerLabel: string;
  stickerAssetSrc: string;
  createdAt: string;
}

export interface UserSettings {
  plan: "free" | "pro";
  language: "ja" | "en";
  customStickers: CustomSticker[];
  groups: unknown[];
}

// API レスポンス
export type ApiOk<T> = { ok: true; data: T };
export type ApiError = { ok: false; error: string };
export type ApiResult<T> = ApiOk<T> | ApiError;
