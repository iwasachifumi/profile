import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getExchangesByUser, insertExchange, ensureUserExists, findProfileOwner, getProfilesByUser } from "@/lib/db";
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

  console.log("[exchanges POST] start", {
    userId: session.userId,
    email: session.email,
    isGuest: session.isGuest,
    exchangeId: body.id,
    method: body.method,
  });

  try {
    await insertExchange(session.userId, body);
    console.log("[exchanges POST] ok →", body.id);

    // ── リバース記録: 相手側にも交換記録を作成（best-effort）──
    if (body.targetProfileId) {
      void (async () => {
        try {
          const target = await findProfileOwner(body.targetProfileId!);
          if (!target || target.ownerId === session.userId) return; // 自分自身はスキップ

          // A（記録した側）のプロフィールをスナップショットとして使用
          const aProfiles = await getProfilesByUser(session.userId);
          const aProfile  = aProfiles.find((p) => p.isPublic) ?? aProfiles[0] ?? null;

          await insertExchange(target.ownerId, {
            id:              crypto.randomUUID(),
            targetProfileId: aProfile?.id ?? null,
            method:          body.method,
            eventName:       body.eventName,
            exchangedAt:     body.exchangedAt,
            snapshot: aProfile ? {
              name:        aProfile.fields?.find((f) => f.label === "名前")?.value || "",
              patternName: aProfile.patternName,
              audience:    aProfile.audience,
              description: aProfile.description,
              handle:      aProfile.handle,
              slug:        aProfile.publicSlug,
            } : {},
            privateNote: "",
            tags:        [],
          });
          console.log("[exchanges POST] reverse exchange created for", target.ownerId);
        } catch (re) {
          // リバース失敗は A 側の記録に影響させない
          console.error("[exchanges POST] reverse exchange failed:", String(re));
        }
      })();
    }

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
