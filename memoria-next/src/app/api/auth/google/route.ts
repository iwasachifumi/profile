import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// GET /api/auth/google
// Google OAuth 認可画面へリダイレクトする
export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Google OAuth が設定されていません" }, { status: 500 });
  }

  // ログイン後の戻り先（?return= があれば state に乗せる）
  const returnTo = request.nextUrl.searchParams.get("return") ?? "/mine";

  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id:     clientId,
    redirect_uri:  redirectUri,
    response_type: "code",
    scope:         "openid email profile",
    access_type:   "offline",
    prompt:        "select_account",
    state:         encodeURIComponent(returnTo),
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
