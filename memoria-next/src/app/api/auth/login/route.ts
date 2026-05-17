import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";
import { verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { err, serverError } from "@/lib/response";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return err("メールアドレスとパスワードを入力してください");

    const user = await findUserByEmail(email.toLowerCase().trim());
    if (!user) return err("メールアドレスまたはパスワードが正しくありません", 401);

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) return err("メールアドレスまたはパスワードが正しくありません", 401);

    if (!user.email_verified) {
      return err("メールアドレスの確認が完了していません。登録時に送信したメールをご確認ください。", 403);
    }

    const token = await createSessionToken(user.id, user.email);
    const response = NextResponse.json(
      { ok: true, data: { id: user.id, email: user.email, isGuest: false } },
      { status: 200 }
    );
    setSessionCookie(response, token);
    return response;
  } catch (e) {
    return serverError(e);
  }
}
