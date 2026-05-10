// fetch の薄ラッパ。全 API 呼び出しはここを通す。
// - credentials: "include" で HttpOnly Cookie を自動送信
// - レスポンスは常に ApiResult<T> 形式

import type { ApiResult } from "@/types";

const BASE = "/api";

export async function apiCall<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json() as Promise<ApiResult<T>>;
  } catch {
    return { ok: false, error: "通信エラーが発生しました" };
  }
}
