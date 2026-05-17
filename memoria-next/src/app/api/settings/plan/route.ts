import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getSettings, upsertSettings } from "@/lib/db";
import { ok, err, unauthorized, serverError } from "@/lib/response";
import type { UserSettings } from "@/types";

export const runtime = "nodejs";

const DEFAULT_SETTINGS: UserSettings = {
  plan: "free",
  language: "ja",
  customStickers: [],
  groups: [],
};

// PUT /api/settings/plan
// body: { plan: "free" | "pro" }
export async function PUT(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    const body = (await request.json()) as { plan?: unknown };
    if (body.plan !== "free" && body.plan !== "pro") {
      return err("plan は 'free' または 'pro' を指定してください");
    }
    const current = (await getSettings(session.userId)) ?? DEFAULT_SETTINGS;
    const next: UserSettings = { ...current, plan: body.plan };
    await upsertSettings(session.userId, session.email, next);
    return ok({ plan: next.plan });
  } catch (e) {
    return serverError(e);
  }
}
