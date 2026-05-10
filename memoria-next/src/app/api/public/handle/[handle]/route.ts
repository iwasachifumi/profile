import { NextRequest } from "next/server";
import { getProfileByHandle } from "@/lib/db";
import { ok, notFound, serverError } from "@/lib/response";

export const runtime = "nodejs";

// GET /api/public/handle/:handle — 認証不要・handle でプロフィール取得
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    const profile = await getProfileByHandle(handle);
    if (!profile) return notFound();
    return ok(profile);
  } catch (e) {
    return serverError(e);
  }
}
