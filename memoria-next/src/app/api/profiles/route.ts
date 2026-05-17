import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getProfilesByUser, insertProfile } from "@/lib/db";
import { ok, err, unauthorized, serverError } from "@/lib/response";
import type { Profile } from "@/types";

export const runtime = "nodejs";

// GET /api/profiles — ログインユーザーの全プロフィール取得
// 初期プロフィールの作成はメール認証完了時（verify-email）に行う
export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    const profiles = await getProfilesByUser(session.userId);
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
