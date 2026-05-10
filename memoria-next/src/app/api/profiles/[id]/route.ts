import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { updateProfile, deleteProfile } from "@/lib/db";
import { ok, unauthorized, serverError } from "@/lib/response";
import type { Profile } from "@/types";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

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
