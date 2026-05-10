import { randomUUID } from "crypto";
import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getProfilesByUser, insertProfile } from "@/lib/db";
import { ok, err, unauthorized, serverError } from "@/lib/response";
import type { Profile } from "@/types";

export const runtime = "nodejs";

/** パターンが 0 件のとき自動生成するデフォルトプロフィール */
function makeDefaultProfile(): Profile {
  return {
    id: randomUUID(),
    publicSlug: null,
    handle: null,
    isPublic: false,
    patternName: "プライベート",
    audience: "友人・知人",
    description: "",
    themeId: "default",
    frameId: "none",
    fields: [],
    links: [],
    stickers: [],
  };
}

// GET /api/profiles — ログインユーザーの全プロフィール取得
// パターンが 0 件なら「プライベート」を自動作成して返す
export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    let profiles = await getProfilesByUser(session.userId);

    if (profiles.length === 0) {
      const defaultProfile = makeDefaultProfile();
      await insertProfile(session.userId, defaultProfile);
      profiles = [defaultProfile];
    }

    return ok(profiles);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/profiles — 新規プロフィール作成
export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    const body = await request.json() as Profile;
    if (!body.id) return err("id は必須です");
    await insertProfile(session.userId, body);
    return ok({ id: body.id }, 201);
  } catch (e) {
    return serverError(e);
  }
}
