-- QRカードビルダーの作業状態を保持するカラム
ALTER TABLE memoria.profiles
  ADD COLUMN IF NOT EXISTS card_config JSONB DEFAULT NULL;
