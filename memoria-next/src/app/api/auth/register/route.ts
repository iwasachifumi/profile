import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/db";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { err, serverError } from "@/lib/response";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) return err("メールアドレスとパスワードを入力してください");
    if (password.length < 8) return err("パスワードは8文字以上にしてください");

    const existing = await findUserByEmail(email.toLowerCase().trim());
    if (existing) return err("このメールアドレスはすでに登録済みです", 409);

    const passwordHash = await hashPassword(password);
    const user = await createUser(email.toLowerCase().trim(), passwordHash);

    const token = await createSessionToken(user.id, user.email);
    const response = NextResponse.json(
      { ok: true, data: { id: user.id, email: user.email } },
      { status: 201 }
    );
    setSessionCookie(response, token);
    return response;
  } catch (e) {
    return serverError(e);
  }
}
