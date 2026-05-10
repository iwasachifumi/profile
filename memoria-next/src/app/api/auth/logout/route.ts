import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true, data: null }, { status: 200 });
  clearSessionCookie(response);
  return response;
}
