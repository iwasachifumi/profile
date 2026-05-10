-- Migration 0004: auth.users への FK 制約を削除
-- 問題: 0001 の CREATE TABLE で owner_id が auth.users(id) を参照していた。
--       0002 で memoria.users への FK を追加したが旧い FK を削除しなかった。
--       その結果、INSERT 時に auth.users に存在しないユーザーIDが FK 違反を起こす。
-- 対策: auth.users への FK 制約を安全に削除する。

-- profiles
ALTER TABLE memoria.profiles
  DROP CONSTRAINT IF EXISTS profiles_owner_id_fkey;

-- exchanges
ALTER TABLE memoria.exchanges
  DROP CONSTRAINT IF EXISTS exchanges_owner_id_fkey;

-- user_settings
ALTER TABLE memoria.user_settings
  DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;

-- 確認: 制約一覧
-- SELECT conname, conrelid::regclass FROM pg_constraint WHERE contype = 'f' AND conrelid::regclass::text LIKE 'memoria.%';
