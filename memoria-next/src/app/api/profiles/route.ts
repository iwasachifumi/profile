import { randomUUID } from "crypto";
import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getProfilesByUser, insertProfile } from "@/lib/db";
import { ok, err, unauthorized, serverError } from "@/lib/response";
import type { Field, Profile } from "@/types";

export const runtime = "nodejs";

/** パターンが 0 件のとき自動生成するデフォルトプロフィール */
function makeDefaultProfile(): Profile {
  const f = (groupId: string, label: string): Field => ({
    id: randomUUID(), groupId, label, value: "", visible: true,
  });

  return {
    id: randomUUID(),
    publicSlug: null,
    handle: null,
    isPublic: false,
    patternName: "プライベート",
    audience: "友人・知人",
    description: "",
    themeId: "default",
    frameId: "none",
    avatarSrc:  null,
    cardConfig: null,
    fields: [
      // ── 基本 ──────────────────────────────────────────────────────────────
      f("basic", "名前"),
      f("basic", "ニックネーム"),
      f("basic", "呼ばれたい名前"),
      f("basic", "誕生日"),
      f("basic", "年齢"),
      f("basic", "星座"),
      f("basic", "出身地"),
      f("basic", "現在の住まい"),
      f("basic", "身長"),
      f("basic", "家族構成"),
      f("basic", "属性"),
      f("basic", "性格を一言で"),
      f("basic", "自分を動物に例えると"),
      f("basic", "第一印象で言われること"),
      f("basic", "口癖"),
      f("basic", "特技"),
      f("basic", "弱点"),
      f("basic", "長所"),
      f("basic", "短所"),
      // ── 生活 ──────────────────────────────────────────────────────────────
      f("life", "朝型 / 夜型"),
      f("life", "インドア / アウトドア"),
      f("life", "休日の過ごし方"),
      f("life", "平均睡眠時間"),
      f("life", "よく行く場所"),
      f("life", "落ち着く場所"),
      f("life", "ストレス解消法"),
      f("life", "ついやってしまうこと"),
      f("life", "最近買ってよかったもの"),
      // ── 仕事・学び ────────────────────────────────────────────────────────
      f("work", "所属"),
      f("work", "仕事内容"),
      f("work", "職歴"),
      f("work", "スキルセット"),
      f("work", "尊敬する人"),
      f("work", "将来やりたいこと"),
      f("work", "今勉強していること"),
      f("work", "最近興味ある技術"),
      f("work", "子供の頃なりたかった職業"),
      // ── 趣味・エンタメ ────────────────────────────────────────────────────
      f("favorite", "趣味"),
      f("favorite", "最近ハマってること"),
      f("favorite", "昔ハマってたこと"),
      f("favorite", "コレクションしてるもの"),
      f("favorite", "推し"),
      f("favorite", "好きな本"),
      f("favorite", "好きな漫画"),
      f("favorite", "好きなアニメ"),
      f("favorite", "好きなゲーム"),
      f("favorite", "好きな映画"),
      f("favorite", "好きなドラマ"),
      f("favorite", "好きな配信者"),
      f("favorite", "好きなタレント"),
      f("favorite", "好きな俳優"),
      f("favorite", "好きなミュージシャン"),
      f("favorite", "好きな曲"),
      f("favorite", "カラオケの定番曲"),
      f("favorite", "泣ける作品"),
      f("favorite", "人生で影響受けた作品"),
      f("favorite", "好きなスポーツ"),
      f("favorite", "やっていたスポーツ"),
      // ── 食・好み ──────────────────────────────────────────────────────────
      f("food", "食べ物の好み"),
      f("food", "好きなお店"),
      f("food", "得意料理"),
      f("food", "辛党 / 甘党"),
      f("food", "コーヒー派 / 紅茶派"),
      f("food", "外食派 / 自炊派"),
      // ── 人間関係・コミュニケーション ──────────────────────────────────────
      f("conversation", "人見知りする？"),
      f("conversation", "話しかけられると嬉しい話題"),
      f("conversation", "初対面で緊張する？"),
      f("conversation", "友達からどんな人って言われる？"),
      f("conversation", "好きなタイプ"),
      f("conversation", "苦手なタイプ"),
      f("conversation", "恋愛傾向"),
      f("conversation", "集団と少人数どっちが好き？"),
      // ── ネット・デジタル ──────────────────────────────────────────────────
      f("digital", "SNSの頻度"),
      f("digital", "よく使うアプリ"),
      f("digital", "ネット歴"),
      f("digital", "AI使ってる？"),
      f("digital", "愛用ガジェット"),
      f("digital", "スマホ派 / PC派"),
      f("digital", "ゲーム歴"),
      f("digital", "初めて触ったゲーム"),
      // ── 価値観・内面 ──────────────────────────────────────────────────────
      f("values", "大切にしていること"),
      f("values", "人生観"),
      f("values", "モットー"),
      f("values", "人生の転機"),
      f("values", "今の夢"),
      f("values", "小さな夢"),
      f("values", "死ぬまでにやりたいこと"),
      f("values", "幸せを感じる瞬間"),
      f("values", "苦手なこと"),
      f("values", "自分の課題"),
      f("values", "つい熱く語ってしまうこと"),
      f("values", "自分を漢字一文字で表すと"),
      f("values", "10年前の自分に一言"),
      f("values", "未来の自分へ一言"),
      // ── もしも系 ──────────────────────────────────────────────────────────
      f("whatif", "無人島に1つ持っていくなら"),
      f("whatif", "1億円あったら何する？"),
      f("whatif", "超能力が1つもらえるなら"),
      f("whatif", "タイムマシンがあったら"),
      f("whatif", "生まれ変わるなら"),
      f("whatif", "魔法が使えたら"),
      f("whatif", "好きな世界観に行けるなら"),
      f("whatif", "ゾンビ世界で生き残れそう？"),
      f("whatif", "最後の日に食べたいもの"),
      // ── フリー ────────────────────────────────────────────────────────────
      f("free", "最近の悩み"),
      f("free", "最近うれしかったこと"),
      f("free", "今一番ほしいもの"),
      f("free", "今会いたい人"),
      f("free", "今行きたい場所"),
      f("free", "自分へのご褒美"),
      f("free", "黒歴史"),
      f("free", "最後に一言！"),
      f("free", "自由記入欄"),
    ],
    links: [],
    stickers: [],
  };
}

// GET /api/profiles — ログインユーザーの全プロフィール取得
// パターンが 0 件なら「プライベート」を自動作成して返す
export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    let profiles = await getProfilesByUser(session.userId);

    if (profiles.length === 0) {
      const defaultProfile = makeDefaultProfile();
      await insertProfile(session.userId, defaultProfile);
      profiles = [defaultProfile];
    }

    return ok(profiles);
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/profiles — 新規プロフィール作成
export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    const body = await request.json() as Profile;
    if (!body.id) return err("id は必須です");
    await insertProfile(session.userId, body);
    return ok({ id: body.id }, 201);
  } catch (e) {
    return serverError(e);
  }
}
