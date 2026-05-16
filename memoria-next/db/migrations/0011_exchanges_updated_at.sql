-- updateExchange が参照している updated_at カラムが本番DBに無いため追加
ALTER TABLE memoria.exchanges
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
