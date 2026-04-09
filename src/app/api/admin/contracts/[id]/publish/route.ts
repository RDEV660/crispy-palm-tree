import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin-session";
import { getContractById, setStatus } from "@/lib/contracts/repo";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, ctx: Ctx) {
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
    if (row.status !== "draft") {
      return NextResponse.json({ error: "Only drafts can be published" }, { status: 409 });
    }
    const ok = await setStatus(id, "sent", ["draft"]);
    if (!ok) return NextResponse.json({ error: "Publish failed" }, { status: 409 });
    return NextResponse.json({ ok: true, publicId: row.public_id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to publish" }, { status: 500 });
  }
}
