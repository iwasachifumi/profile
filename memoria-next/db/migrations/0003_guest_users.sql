-- Migration 0003: ゲストユーザー対応
-- お試し利用ユーザーは email / password_hash なしで作成できるようにする。

ALTER TABLE memoria.users
  ALTER COLUMN email         DROP NOT NULL,
  ALTER COLUMN password_hash DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS is_guest BOOLEAN NOT NULL DEFAULT FALSE;

-- email の一意制約は NULL を除いて維持される（PostgreSQL の UNIQUE は NULL を除外する）
-- 既存データへの影響なし。
