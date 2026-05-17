import nodemailer from "nodemailer";
import type { Lang } from "@/store/language";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "localhost",
  port: Number(process.env.SMTP_PORT ?? 25),
  secure: false,
  ignoreTLS: true,
});

const FROM = process.env.MAIL_FROM ?? "noreply@ac7.co.jp";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://profile.ac7.co.jp";

// ── メールテンプレート ──────────────────────────────────────────────────────

function verificationEmailContent(token: string, lang: Lang) {
  const url = `${BASE_URL}/api/auth/verify-email?token=${token}`;

  if (lang === "en") {
    return {
      subject: "[Memoria] Please verify your email address",
      text: `Thank you for registering with Memoria.

Please click the link below to verify your email address.
This link is valid for 24 hours.

${url}

If you did not create an account, please ignore this email.

---
Memoria | profile.ac7.co.jp`,
      html: `<p>Thank you for registering with Memoria.</p>
<p>Please click the link below to verify your email address.<br>
This link is valid for 24 hours.</p>
<p><a href="${url}" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;">Verify Email Address</a></p>
<p>If you did not create an account, please ignore this email.</p>
<hr>
<p style="color:#888;font-size:12px;">Memoria | profile.ac7.co.jp</p>`,
    };
  }

  return {
    subject: "【Memoria】メールアドレスの確認をお願いします",
    text: `Memoriaへのご登録ありがとうございます。

以下のリンクをクリックして、メールアドレスの確認を完了してください。
このリンクは24時間有効です。

${url}

心当たりのない場合は、このメールを無視していただいて構いません。

---
Memoria | profile.ac7.co.jp`,
    html: `<p>Memoriaへのご登録ありがとうございます。</p>
<p>以下のリンクをクリックして、メールアドレスの確認を完了してください。<br>
このリンクは24時間有効です。</p>
<p><a href="${url}" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;">メールアドレスを確認する</a></p>
<p>心当たりのない場合は、このメールを無視していただいて構いません。</p>
<hr>
<p style="color:#888;font-size:12px;">Memoria | profile.ac7.co.jp</p>`,
  };
}

// ── 送信関数 ────────────────────────────────────────────────────────────────

export async function sendVerificationEmail(
  to: string,
  token: string,
  lang: Lang = "ja"
): Promise<void> {
  const { subject, text, html } = verificationEmailContent(token, lang);
  await transporter.sendMail({ from: FROM, to, subject, text, html });
}
