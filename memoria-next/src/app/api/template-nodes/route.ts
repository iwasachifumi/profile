import { getTemplateNodes } from "@/lib/db";
import { ok, serverError } from "@/lib/response";

export const runtime = "nodejs";

// GET /api/template-nodes — 公開エンドポイント（認証不要）
export async function GET() {
  try {
    const nodes = await getTemplateNodes();
    return ok(nodes);
  } catch (e) {
    return serverError(e);
  }
}
