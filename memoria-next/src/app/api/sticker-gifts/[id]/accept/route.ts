import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { acceptStickerGift } from "@/lib/db";
import { err, notFound, ok, unauthorized, serverError } from "@/lib/response";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

// POST /api/sticker-gifts/:id/accept
export async function POST(request: NextRequest, { params }: Params) {
  const session = await getSession(request);
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    const result = await acceptStickerGift(session.userId, session.email, id);
    if (result.status === "not_found") return notFound();
    if (result.status === "not_pending") return err("gift is already processed", 409);
    if (result.status !== "accepted") return err("failed to accept gift", 500);
    return ok({ id, status: "accepted", added: result.added });
  } catch (e) {
    return serverError(e);
  }
}
