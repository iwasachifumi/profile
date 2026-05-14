-- Migration 0007: Google OAuth 対応
-- google_id カラムを追加する。
-- password_hash は 0003_guest_users.sql で既に NULL 許容済み。
-- 実行: psql または Supabase Studio の SQL Editor で実行。

ALTER TABLE memoria.users
  ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE;

-- インデックス（google_id での高速検索用）
CREATE INDEX IF NOT EXISTS users_google_id_idx
  ON memoria.users (google_id)
  WHERE google_id IS NOT NULL;
