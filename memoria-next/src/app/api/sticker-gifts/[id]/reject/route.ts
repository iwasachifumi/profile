import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { rejectStickerGift } from "@/lib/db";
import { err, notFound, ok, unauthorized, serverError } from "@/lib/response";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

// POST /api/sticker-gifts/:id/reject
export async function POST(request: NextRequest, { params }: Params) {
  const session = await getSession(request);
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    const result = await rejectStickerGift(session.userId, id);
    if (result.status === "not_found") return notFound();
    if (result.status === "not_pending") return err("gift is already processed", 409);
    return ok({ id, status: "rejected" });
  } catch (e) {
    return serverError(e);
  }
}
