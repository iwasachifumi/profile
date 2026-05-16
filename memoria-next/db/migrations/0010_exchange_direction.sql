-- 交換記録の方向
-- outbound: 自分が能動的に登録した（相手のプロフを見て記録した）
-- inbound : 相手が登録した結果、リバース記録として自動生成された
ALTER TABLE memoria.exchanges
  ADD COLUMN IF NOT EXISTS direction TEXT NOT NULL DEFAULT 'outbound';

CREATE INDEX IF NOT EXISTS idx_exchanges_owner_direction
  ON memoria.exchanges (owner_id, direction);
