import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getExchangesByUser, insertExchange } from "@/lib/db";
import { ok, err, unauthorized, serverError } from "@/lib/response";
import type { Exchange } from "@/types";

export const runtime = "nodejs";

// GET /api/exchanges
export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    const exchanges = await getExchangesByUser(session.userId);
    return ok(exchanges);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/exchanges
export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    const body = await request.json() as Exchange;
    if (!body.id) return err("id は必須です");
    await insertExchange(session.userId, body);
    return ok({ id: body.id }, 201);
  } catch (e) {
    return serverError(e);
  }
}
