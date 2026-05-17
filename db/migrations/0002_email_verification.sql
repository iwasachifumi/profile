-- Memoria: メールアドレス確認機能
-- 適用: psql $DATABASE_URL -f db/migrations/0002_email_verification.sql

ALTER TABLE memoria.users
  ADD COLUMN IF NOT EXISTS email_verified            boolean     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_verification_token  text,
  ADD COLUMN IF NOT EXISTS email_verification_expires_at timestamptz;

CREATE INDEX IF NOT EXISTS users_verification_token_idx
  ON memoria.users (email_verification_token)
  WHERE email_verification_token IS NOT NULL;
