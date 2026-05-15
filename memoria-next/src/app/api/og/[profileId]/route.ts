import { NextRequest } from "next/server";
import { writeFile, mkdir, readFile, stat } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";
import { unauthorized, serverError, ok } from "@/lib/response";

export const runtime = "nodejs";

type Params = { params: Promise<{ profileId: string }> };

const OG_DIR = path.join(process.cwd(), "public", "og");

// POST /api/og/:profileId — PNG blob を受け取ってファイルに保存
export async function POST(request: NextRequest, { params }: Params) {
  const session = await getSession(request);
  if (!session) return unauthorized();

  try {
    const { profileId } = await params;
    const buffer = Buffer.from(await request.arrayBuffer());
    await mkdir(OG_DIR, { recursive: true });
    await writeFile(path.join(OG_DIR, `${profileId}.png`), buffer);
    return ok({ saved: true });
  } catch (e) {
    return serverError(e);
  }
}

// GET /api/og/:profileId — PNG を配信（OGメタタグ・クローラー向け）
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { profileId } = await params;
    const filePath = path.join(OG_DIR, `${profileId}.png`);
    const [buffer, fileStat] = await Promise.all([readFile(filePath), stat(filePath)]);
    const lastModified = fileStat.mtime.toUTCString();

    // If-Modified-Since による条件リクエストに対応
    const ifModifiedSince = request.headers.get("if-modified-since");
    if (ifModifiedSince && new Date(ifModifiedSince) >= fileStat.mtime) {
      return new Response(null, { status: 304 });
    }

    return new Response(buffer, {
      headers: {
        "Content-Type":  "image/png",
        "Cache-Control": "no-cache",   // 毎回サーバーで再検証（古い画像を返さない）
        "Last-Modified": lastModified,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
