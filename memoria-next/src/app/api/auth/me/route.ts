import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { ok, unauthorized } from "@/lib/response";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  return ok({ id: session.userId, email: session.email });
}
