-- Migration 0004: auth.users への FK 制約を動的に削除
-- 問題: 0001 の CREATE TABLE で owner_id が auth.users(id) を参照していた。
--       0002 で memoria.users への FK を追加したが旧い FK を削除しなかった。
--       その結果、INSERT 時に auth.users に存在しないユーザーIDが FK 違反を起こす。
-- 対策: pg_constraint を検索して auth.users を参照する FK を全て動的に削除する。

DO $$
DECLARE
  c          record;
  auth_oid   oid;
BEGIN
  -- auth.users テーブルの oid を取得（存在しない場合は NULL）
  SELECT pg_class.oid INTO auth_oid
  FROM   pg_class
  JOIN   pg_namespace ON pg_namespace.oid = pg_class.relnamespace
  WHERE  pg_namespace.nspname = 'auth'
    AND  pg_class.relname     = 'users';

  IF auth_oid IS NULL THEN
    RAISE NOTICE 'auth.users が存在しません。スキップします。';
    RETURN;
  END IF;

  -- memoria スキーマ内で auth.users を参照する FK 制約を全件削除
  FOR c IN
    SELECT con.conname, con.conrelid::regclass AS tbl
    FROM   pg_constraint con
    JOIN   pg_namespace  ns  ON ns.oid = con.connamespace
    WHERE  con.contype = 'f'
      AND  con.confrelid = auth_oid
      AND  ns.nspname   = 'memoria'
  LOOP
    RAISE NOTICE '削除: % on %', c.conname, c.tbl;
    EXECUTE format('ALTER TABLE %s DROP CONSTRAINT %I', c.tbl, c.conname);
  END LOOP;
END $$;
