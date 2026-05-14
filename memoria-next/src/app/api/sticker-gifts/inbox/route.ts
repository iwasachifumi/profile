import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { listPendingStickerGifts } from "@/lib/db";
import { ok, unauthorized, serverError } from "@/lib/response";

export const runtime = "nodejs";

// GET /api/sticker-gifts/inbox
export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    const items = await listPendingStickerGifts(session.userId);
    return ok(items);
  } catch (e) {
    return serverError(e);
  }
}
