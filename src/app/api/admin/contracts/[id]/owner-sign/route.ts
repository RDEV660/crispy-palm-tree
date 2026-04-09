import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin-session";
import { applyOwnerSignature, getContractById } from "@/lib/contracts/repo";
import { ownerSignBodySchema } from "@/lib/contracts/schema";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const denied = await requireAdminSession();
  if (denied) return denied;
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isFinite(id) || id < 1) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const raw = await req.json();
    const body = ownerSignBodySchema.parse(raw);
    const row = await getContractById(id);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (row.status !== "client_signed") {
      return NextResponse.json({ error: "Client must sign first" }, { status: 409 });
    }
    const ok = await applyOwnerSignature(id, body.signatureDataUrl);
    if (!ok) return NextResponse.json({ error: "Could not save owner signature" }, { status: 409 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "Failed to sign";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
