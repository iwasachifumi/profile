import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { updateExchange, deleteExchange } from "@/lib/db";
import { ok, unauthorized, serverError } from "@/lib/response";
import type { Exchange } from "@/types";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

// PUT /api/exchanges/:id
export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    const { id } = await params;
    const body = await request.json() as Partial<Exchange>;
    await updateExchange(session.userId, id, body);
    return ok({ id });
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/exchanges/:id
export async function DELETE(request: NextRequest, { params }: Params) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  try {
    const { id } = await params;
    await deleteExchange(session.userId, id);
    return ok({ id });
  } catch (e) {
    return serverError(e);
  }
}
