-- Migration 0005: profiles_owner_id_fkey を名前指定で強制削除
-- 0004 の動的 SQL が auth.users を参照する FK を検出できなかった場合の補完。
-- このマイグレーションは冪等（制約が無ければ IF EXISTS でスキップ）。

ALTER TABLE memoria.profiles
  DROP CONSTRAINT IF EXISTS profiles_owner_id_fkey;

ALTER TABLE memoria.exchanges
  DROP CONSTRAINT IF EXISTS exchanges_owner_id_fkey;

-- 念のため: 存在しない場合でもエラーにしない
DO $$
BEGIN
  RAISE NOTICE '0005 完了: auth.users FK 制約を削除しました（または既に存在しませんでした）';
END $$;
