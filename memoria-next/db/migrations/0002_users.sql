-- Migration 0002: memoria.users テーブル
-- GoTrue (auth.users) とは完全に独立した Memoria 専用のユーザー管理。
-- 実行: Supabase Studio の SQL Editor、または psql で実行。

-- ── テーブル ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS memoria.users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at 自動更新トリガー（0001 で作成済みの関数を流用）
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON memoria.users
  FOR EACH ROW EXECUTE FUNCTION memoria.touch_updated_at();

-- ── アプリ用ロール ────────────────────────────────────────────────────────────
-- Next.js サーバから直接接続するロール。PostgREST / GoTrue は使わない。
-- パスワードは本番環境に合わせて変更すること。

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'memoria_app') THEN
    CREATE ROLE memoria_app NOLOGIN;
  END IF;
END $$;

-- If this project needs direct DB login with memoria_app, run explicitly:
-- ALTER ROLE memoria_app WITH LOGIN PASSWORD '<strong_password>';

GRANT USAGE ON SCHEMA memoria TO memoria_app;
GRANT ALL ON ALL TABLES    IN SCHEMA memoria TO memoria_app;
GRANT ALL ON ALL SEQUENCES IN SCHEMA memoria TO memoria_app;

-- 今後追加されるテーブルにも自動付与
ALTER DEFAULT PRIVILEGES IN SCHEMA memoria
  GRANT ALL ON TABLES TO memoria_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA memoria
  GRANT ALL ON SEQUENCES TO memoria_app;

-- ── profiles / exchanges の owner_id を memoria.users に紐づける ──────────────
-- 0001 では owner_id は uuid 型だが外部キーは未設定。
-- GoTrue の auth.users を参照していた前提を外し、memoria.users に変更する。
-- 既存データが無い状態で適用すること。

ALTER TABLE memoria.profiles
  ADD CONSTRAINT profiles_owner_fk
  FOREIGN KEY (owner_id) REFERENCES memoria.users(id) ON DELETE CASCADE;

ALTER TABLE memoria.exchanges
  ADD CONSTRAINT exchanges_owner_fk
  FOREIGN KEY (owner_id) REFERENCES memoria.users(id) ON DELETE CASCADE;

ALTER TABLE memoria.user_settings
  ADD CONSTRAINT user_settings_owner_fk
  FOREIGN KEY (user_id) REFERENCES memoria.users(id) ON DELETE CASCADE;
