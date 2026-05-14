import { NextRequest, NextResponse } from "next/server";
import { findOrCreateGoogleUser } from "@/lib/db";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

interface GoogleUserInfo {
  sub: string;       // Google の一意 ID
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
}

// GET /api/auth/google/callback
// Google から code を受け取り、セッションを作成してリダイレクトする
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code  = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin;

  // ユーザーがキャンセルした場合
  if (error) {
    return NextResponse.redirect(`${origin}/?google_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/?google_error=no_code`);
  }

  const clientId     = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const redirectUri  = `${origin}/api/auth/google/callback`;

  try {
    // ── 1. code → token 交換 ──────────────────────────────────────────────────
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id:     clientId,
        client_secret: clientSecret,
        redirect_uri:  redirectUri,
        grant_type:    "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("Google token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${origin}/?google_error=token_failed`);
    }

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;

    // ── 2. ユーザー情報取得 ───────────────────────────────────────────────────
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userInfoRes.ok) {
      console.error("Google userinfo fetch failed:", await userInfoRes.text());
      return NextResponse.redirect(`${origin}/?google_error=userinfo_failed`);
    }

    const userInfo = (await userInfoRes.json()) as GoogleUserInfo;

    if (!userInfo.email || !userInfo.email_verified) {
      return NextResponse.redirect(`${origin}/?google_error=email_not_verified`);
    }

    // ── 3. DB に find-or-create ───────────────────────────────────────────────
    const user = await findOrCreateGoogleUser(userInfo.email, userInfo.sub);

    // ── 4. セッション Cookie を発行してリダイレクト ──────────────────────────
    const sessionToken = await createSessionToken(user.id, user.email, false);

    const returnTo = state ? decodeURIComponent(state) : "/mine";
    // state に外部 URL が混入しないよう、同一オリジンのパスのみ許可
    const safePath = returnTo.startsWith("/") ? returnTo : "/mine";

    const response = NextResponse.redirect(`${origin}${safePath}`);
    setSessionCookie(response, sessionToken);
    return response;

  } catch (e) {
    console.error("Google OAuth callback error:", e);
    return NextResponse.redirect(`${origin}/?google_error=server_error`);
  }
}
