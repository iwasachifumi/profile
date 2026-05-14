import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getSettings, upsertSettings } from "@/lib/db";
import { ok, unauthorized, serverError } from "@/lib/response";
import type { UserSettings } from "@/types";

export const runtime = "nodejs";

const DEFAULT_SETTINGS: UserSettings = {
  plan: "free",
  language: "ja",
  customStickers: [],
  groups: [],
};

// GET /api/settings
export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    const settings = await getSettings(session.userId);
    return ok(settings ?? DEFAULT_SETTINGS);
  } catch (e) {
    return serverError(e);
  }
}

// PUT /api/settings
export async function PUT(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    const body = (await request.json()) as Partial<UserSettings>;
    const current = (await getSettings(session.userId)) ?? DEFAULT_SETTINGS;

    const next: UserSettings = {
      // plan is server-controlled for now; do not trust client payload.
      plan: current.plan,
      language:
        body.language === "ja" || body.language === "en"
          ? body.language
          : current.language,
      customStickers: Array.isArray(body.customStickers)
        ? body.customStickers
        : current.customStickers,
      groups: Array.isArray(body.groups) ? body.groups : current.groups,
    };

    await upsertSettings(session.userId, session.email, next);
    return ok(null);
  } catch (e) {
    return serverError(e);
  }
}
