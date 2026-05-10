import { NextResponse } from "next/server";
import type { ApiResult } from "@/types";

export function ok<T>(data: T, status = 200): NextResponse<ApiResult<T>> {
  return NextResponse.json({ ok: true, data }, { status });
}

export function err(message: string, status = 400): NextResponse<ApiResult<never>> {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export const unauthorized = () => err("認証が必要です", 401);
export const notFound     = () => err("見つかりません", 404);
export const serverError  = (e?: unknown) => {
  console.error(e);
  return err("サーバエラーが発生しました", 500);
};
