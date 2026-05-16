import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getExchangesByUser, insertExchange, ensureUserExists } from "@/lib/db";
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

  // body は一度しか読めないので先にパースする
  let body: Exchange;
  try {
    body = await request.json() as Exchange;
  } catch {
    return err("リクエストの形式が不正です");
  }
  if (!body.id) return err("id は必須です");

  try {
    await insertExchange(session.userId, body);
    return ok({ id: body.id }, 201);
  } catch (e) {
    const code = typeof e === "object" && e !== null ? (e as { code?: string }).code : undefined;
    console.error("[exchanges POST] insertExchange failed", {
      userId: session.userId,
      email: session.email,
      isGuest: session.isGuest,
      pgCode: code,
      error: String(e),
    });

    // 外部キー制約違反 = セッションのユーザーIDがDBに存在しない
    // → ユーザーレコードを自動作成してリトライ（クッキー削除できない端末の救済）
    if (code === "23503") {
      try {
        console.log("[exchanges POST] 23503: ensureUserExists →", session.userId);
        await ensureUserExists(session.userId, session.email, session.isGuest);
        await insertExchange(session.userId, body);
        console.log("[exchanges POST] retry succeeded →", body.id);
        return ok({ id: body.id }, 201);
      } catch (e2) {
        console.error("[exchanges POST] retry failed", String(e2));
        return serverError(e2);
      }
    }
    return serverError(e);
  }
}
