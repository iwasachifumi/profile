import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getSettings, upsertSettings } from "@/lib/db";
import { ok, unauthorized, notFound, serverError } from "@/lib/response";
import type { UserSettings } from "@/types";

export const runtime = "nodejs";

// GET /api/settings
export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    const settings = await getSettings(session.userId);
    if (!settings) return notFound();
    return ok(settings);
  } catch (e) {
    return serverError(e);
  }
}

// PUT /api/settings
export async function PUT(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    const body = await request.json() as UserSettings;
    await upsertSettings(session.userId, session.email, body);
    return ok(null);
  } catch (e) {
    return serverError(e);
  }
}
