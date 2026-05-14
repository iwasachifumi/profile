-- Migration 0006: sticker gift inbox

CREATE TABLE IF NOT EXISTS memoria.sticker_gifts (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_user_id     UUID        NOT NULL REFERENCES memoria.users(id) ON DELETE CASCADE,
  recipient_user_id  UUID        NOT NULL REFERENCES memoria.users(id) ON DELETE CASCADE,
  sticker_label      TEXT        NOT NULL,
  sticker_asset_src  TEXT        NOT NULL,
  sticker_asset_hash TEXT        NOT NULL,
  status             TEXT        NOT NULL DEFAULT 'pending',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at        TIMESTAMPTZ,
  rejected_at        TIMESTAMPTZ,
  CONSTRAINT sticker_gifts_status_check CHECK (status IN ('pending', 'accepted', 'rejected')),
  CONSTRAINT sticker_gifts_sender_recipient_check CHECK (sender_user_id <> recipient_user_id)
);

CREATE INDEX IF NOT EXISTS sticker_gifts_recipient_pending_idx
  ON memoria.sticker_gifts (recipient_user_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS sticker_gifts_sender_idx
  ON memoria.sticker_gifts (sender_user_id, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS sticker_gifts_pending_unique
  ON memoria.sticker_gifts (sender_user_id, recipient_user_id, sticker_asset_hash)
  WHERE status = 'pending';

DROP TRIGGER IF EXISTS sticker_gifts_updated_at ON memoria.sticker_gifts;
CREATE TRIGGER sticker_gifts_updated_at
  BEFORE UPDATE ON memoria.sticker_gifts
  FOR EACH ROW EXECUTE FUNCTION memoria.touch_updated_at();
