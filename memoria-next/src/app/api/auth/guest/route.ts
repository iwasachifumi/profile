import { NextResponse } from "next/server";
import { createGuestUser } from "@/lib/db";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { serverError } from "@/lib/response";

export const runtime = "nodejs";

export async function POST() {
  try {
    const user = await createGuestUser();
    const token = await createSessionToken(user.id as string, "", true);
    const response = NextResponse.json(
      { ok: true, data: { id: user.id, email: "", isGuest: true } },
      { status: 201 }
    );
    setSessionCookie(response, token);
    return response;
  } catch (e) {
    return serverError(e);
  }
}
