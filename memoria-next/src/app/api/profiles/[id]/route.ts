import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getProfilesByUser, updateProfile, deleteProfile } from "@/lib/db";
import { ok, err, unauthorized, serverError } from "@/lib/response";
import type { Profile } from "@/types";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

// GET /api/profiles/:id — オーナー自身がプレビュー用に取得
export async function GET(request: NextRequest, { params }: Params) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    const { id } = await params;
    const profiles = await getProfilesByUser(session.userId);
    const profile = profiles.find((p) => p.id === id) ?? null;
    if (!profile) return err("Profile not found", 404);
    return ok(profile);
  } catch (e) {
    return serverError(e);
  }
}

// PUT /api/profiles/:id — 更新
export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    const { id } = await params;
    const body = await request.json() as Partial<Profile>;
    await updateProfile(session.userId, id, body);
    return ok({ id });
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/profiles/:id — 削除
export async function DELETE(request: NextRequest, { params }: Params) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    const { id } = await params;
    await deleteProfile(session.userId, id);
    return ok({ id });
  } catch (e) {
    return serverError(e);
  }
}
