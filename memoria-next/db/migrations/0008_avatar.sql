-- プロフィールにアバター画像(base64 data URL)を追加
ALTER TABLE memoria.profiles
  ADD COLUMN IF NOT EXISTS avatar_src TEXT DEFAULT NULL;
