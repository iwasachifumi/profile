-- Migration 0012: user_settings_user_id_fkey を名前指定で強制削除
-- 0001 では memoria.user_settings.user_id が auth.users(id) を参照していた。
-- 0002 で memoria.users への FK (user_settings_owner_fk) は追加されたが、
-- 旧 FK (user_settings_user_id_fkey) は削除されないまま残っていた。
-- 0005 で profiles / exchanges の同類 FK は名前指定で落とされたが、
-- user_settings 分は落とし漏れ。
-- 結果: Google ログイン等で memoria.users にしか存在しないユーザーが
--       user_settings に upsert すると FK 違反 (23503) で 500 になる。
--
-- このマイグレーションは冪等（制約が無ければ IF EXISTS でスキップ）。

ALTER TABLE memoria.user_settings
  DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;

DO $$
BEGIN
  RAISE NOTICE '0012 完了: user_settings_user_id_fkey を削除しました（または既に存在しませんでした）';
END $$;
