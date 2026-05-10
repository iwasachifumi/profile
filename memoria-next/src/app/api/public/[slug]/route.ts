import { NextRequest } from "next/server";
import { getProfileBySlug } from "@/lib/db";
import { ok, notFound, serverError } from "@/lib/response";

export const runtime = "nodejs";

// GET /api/public/:slug — 認証不要・公開プロフィール取得
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const profile = await getProfileBySlug(slug);
    if (!profile) return notFound();
    return ok(profile);
  } catch (e) {
    return serverError(e);
  }
}
