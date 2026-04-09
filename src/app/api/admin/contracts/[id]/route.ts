import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin-session";
import { getContractById, rowPayload, updateContractPayload } from "@/lib/contracts/repo";
import { contractPayloadSchema } from "@/lib/contracts/schema";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const denied = await requireAdminSession();
  if (denied) return denied;
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isFinite(id) || id < 1) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const row = await getContractById(id);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      id: row.id,
      publicId: row.public_id,
      status: row.status,
      locale: row.locale,
      legalVersion: row.legal_version,
      payload: rowPayload(row),
      clientSignatureDataUrl: row.client_signature_data_url,
      ownerSignatureDataUrl: row.owner_signature_data_url,
      clientSignedAt: row.client_signed_at,
      ownerSignedAt: row.owner_signed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  const denied = await requireAdminSession();
  if (denied) return denied;
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isFinite(id) || id < 1) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const body = (await req.json()) as { payload?: unknown };
    const payload = contractPayloadSchema.parse(body.payload ?? {});
    const row = await getContractById(id);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (row.status !== "draft") {
      return NextResponse.json({ error: "Only draft contracts can be edited" }, { status: 409 });
    }
    const ok = await updateContractPayload(id, payload, ["draft"]);
    if (!ok) return NextResponse.json({ error: "Update failed" }, { status: 409 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "Failed to update";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
