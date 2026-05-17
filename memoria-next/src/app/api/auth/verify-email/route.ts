import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { findUserByVerificationToken, markEmailVerified, insertProfile } from "@/lib/db";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import type { Field, Profile } from "@/types";

export const runtime = "nodejs";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://profile.ac7.co.jp";

function f(groupId: string, label: string, value: string = ""): Field {
  return { id: randomUUID(), groupId, label, value, visible: true };
}

function buildInitialProfile(): Profile {
  return {
    id: randomUUID(),
    publicSlug: null,
    handle: null,
    isPublic: false,
    patternName: "プロフィール",
    audience: "",
    description: "",
    themeId: "default",
    frameId: "none",
    avatarSrc: null,
    cardConfig: null,
    fields: [
      f("basic",        "名前",               "まだ名前なし"),
      f("basic",        "ニックネーム",        "まだない"),
      f("basic",        "呼ばれたい名前",      "好きに呼んで"),
      f("basic",        "出身地",              "地球！"),
      f("conversation", "家族構成",            "親はいる"),
      f("whatif",       "自分を動物に例えると", "二足歩行のいきもの！"),
      f("life",         "落ち着く場所",        "ベッドの中"),
      f("life",         "ついやってしまうこと", "ネット"),
      f("values",       "尊敬する人",          "エジソン"),
      f("favorite",     "最近ハマってること",   "推し活"),
      f("favorite",     "昔ハマってたこと",    "つかまり立ち"),
      f("favorite",     "推し",                "秘密！"),
      f("free",         "自由記入欄",          "とりあえず、いろいろ書いてみよう！"),
    ],
    links: [],
    stickers: [],
  };
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${BASE_URL}/login?verify_error=invalid`);
  }

  const user = await findUserByVerificationToken(token);

  if (!user) {
    return NextResponse.redirect(`${BASE_URL}/login?verify_error=invalid`);
  }

  const expiresAt = new Date(user.email_verification_expires_at as string);
  if (expiresAt < new Date()) {
    return NextResponse.redirect(`${BASE_URL}/login?verify_error=expired`);
  }

  await markEmailVerified(user.id as string);

  // 初期プロフィールを作成
  await insertProfile(user.id as string, buildInitialProfile());

  const sessionToken = await createSessionToken(user.id as string, user.email as string, false);
  const response = NextResponse.redirect(`${BASE_URL}/mine`);
  setSessionCookie(response, sessionToken);
  return response;
}
