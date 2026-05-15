import { NextRequest } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
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

// GET /api/og/:profileId — PNG を配信（crawlerがアクセスする場合のフォールバック）
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { profileId } = await params;
    const filePath = path.join(OG_DIR, `${profileId}.png`);
    const buffer = await readFile(filePath);
    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
