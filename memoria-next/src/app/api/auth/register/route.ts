import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createUser, findUserByEmail } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mailer";
import { err, serverError } from "@/lib/response";
import type { Lang } from "@/store/language";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { email, password, lang } = await request.json() as {
      email: string;
      password: string;
      lang?: Lang;
    };

    if (!email || !password) return err("メールアドレスとパスワードを入力してください");
    if (password.length < 8) return err("パスワードは8文字以上にしてください");

    const existing = await findUserByEmail(email.toLowerCase().trim());
    if (existing) return err("このメールアドレスはすでに登録済みです", 409);

    const passwordHash = await hashPassword(password);

    // メール確認トークン生成（24時間有効）
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await createUser(email.toLowerCase().trim(), passwordHash, token, expiresAt);

    // 確認メール送信
    const language: Lang = lang === "en" ? "en" : "ja";
    await sendVerificationEmail(email.toLowerCase().trim(), token, language);

    return NextResponse.json({ ok: true, requiresVerification: true }, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
