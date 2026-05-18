import { NextRequest } from "next/server";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";
import { getUserPasswordHash, updateUserPassword } from "@/lib/db";
import { err, ok, unauthorized, serverError } from "@/lib/response";

export const runtime = "nodejs";

type ChangePasswordBody = {
  currentPassword?: unknown;
  newPassword?: unknown;
};

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();

  try {
    const body = (await request.json().catch(() => null)) as ChangePasswordBody | null;
    const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

    if (!currentPassword || !newPassword) {
      return err("現在のパスワードと新しいパスワードを入力してください");
    }
    if (newPassword.length < 8) {
      return err("新しいパスワードは8文字以上にしてください");
    }

    const currentHash = await getUserPasswordHash(session.userId);
    if (!currentHash) {
      return err("このアカウントはパスワード認証を使用していません（Google認証のみ）", 400);
    }

    const valid = await verifyPassword(currentPassword, currentHash);
    if (!valid) {
      return err("現在のパスワードが正しくありません", 400);
    }

    const newHash = await hashPassword(newPassword);
    await updateUserPassword(session.userId, newHash);

    return ok(null);
  } catch (e) {
    return serverError(e);
  }
}
