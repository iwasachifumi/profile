import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { createStickerGift, findUserIdByHandle, getSettings } from "@/lib/db";
import { err, ok, unauthorized, serverError } from "@/lib/response";

export const runtime = "nodejs";

const HANDLE_RE = /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/;
const MAX_LABEL_LEN = 80;
const MAX_ASSET_SRC_LEN = 2_000_000;

type GiftStickerPayload = {
  label?: unknown;
  assetSrc?: unknown;
};

type CreateStickerGiftBody = {
  toHandle?: unknown;
  sticker?: GiftStickerPayload;
};

function normalizeHandle(raw: string): string {
  return raw.trim().replace(/^@+/, "");
}

// POST /api/sticker-gifts
export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();

  try {
    const body = (await request.json()) as CreateStickerGiftBody;
    const handleRaw = typeof body.toHandle === "string" ? body.toHandle : "";
    const toHandle = normalizeHandle(handleRaw);
    if (!HANDLE_RE.test(toHandle)) return err("handle format is invalid");

    const stickerLabel = typeof body.sticker?.label === "string" ? body.sticker.label.trim() : "";
    const stickerAssetSrc = typeof body.sticker?.assetSrc === "string" ? body.sticker.assetSrc : "";
    if (!stickerLabel || stickerLabel.length > MAX_LABEL_LEN) return err("sticker label is invalid");
    if (!stickerAssetSrc.startsWith("data:image/")) return err("sticker image must be a data URL");
    if (stickerAssetSrc.length > MAX_ASSET_SRC_LEN) return err("sticker image is too large");

    const senderSettings = await getSettings(session.userId);
    if (!senderSettings || senderSettings.plan !== "pro") return err("pro plan required", 403);

    const senderHasSticker = senderSettings.customStickers.some(
      (sticker) => sticker.assetSrc === stickerAssetSrc
    );
    if (!senderHasSticker) return err("you can only gift your own custom sticker", 403);

    const recipientUserId = await findUserIdByHandle(toHandle);
    if (!recipientUserId) return err("recipient handle not found", 404);
    if (recipientUserId === session.userId) return err("cannot gift to yourself");

    const giftId = await createStickerGift(
      session.userId,
      recipientUserId,
      stickerLabel,
      stickerAssetSrc
    );
    if (!giftId) return err("same sticker gift is already pending", 409);

    return ok({ id: giftId }, 201);
  } catch (e) {
    return serverError(e);
  }
}
