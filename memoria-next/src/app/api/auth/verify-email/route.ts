import { NextRequest, NextResponse } from "next/server";
import { findUserByVerificationToken, markEmailVerified } from "@/lib/db";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://profile.ac7.co.jp";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${BASE_URL}/login?verify_error=invalid`);
  }

  const user = await findUserByVerificationToken(token);

  if (!user) {
    return NextResponse.redirect(`${BASE_URL}/login?verify_error=invalid`);
  }

  // トークン有効期限チェック
  const expiresAt = new Date(user.email_verification_expires_at as string);
  if (expiresAt < new Date()) {
    return NextResponse.redirect(`${BASE_URL}/login?verify_error=expired`);
  }

  // 確認完了・セッション発行
  await markEmailVerified(user.id as string);

  const sessionToken = await createSessionToken(user.id as string, user.email as string, false);
  const response = NextResponse.redirect(`${BASE_URL}/mine`);
  setSessionCookie(response, sessionToken);
  return response;
}
