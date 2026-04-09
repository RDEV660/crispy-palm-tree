import { NextResponse } from "next/server";
import { applyClientSignature, getContractByPublicId, rowPayload } from "@/lib/contracts/repo";
import { clientSignBodySchema, contractPayloadSchema } from "@/lib/contracts/schema";
import { DEPOSIT_CENTS } from "@/lib/contracts/constants";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ publicId: string }> };

function clientIp(req: Request): string | null {
  const fwd = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for");
  if (!fwd) return null;
  return fwd.split(",")[0]?.trim() ?? null;
}

export async function POST(req: Request, ctx: Ctx) {
  const { publicId } = await ctx.params;
  if (!publicId || publicId.length > 64) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
  try {
    const raw = await req.json();
    const body = clientSignBodySchema.parse(raw);
    const row = await getContractByPublicId(publicId);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (row.status !== "sent") {
      return NextResponse.json({ error: "This contract is not open for signing" }, { status: 409 });
    }

    const prev = rowPayload(row);
    const payload = contractPayloadSchema.parse({
      ...prev,
      paymentMethod: body.paymentMethod,
      depositCents: DEPOSIT_CENTS,
    });

    const ok = await applyClientSignature(publicId, {
      payload,
      signatureDataUrl: body.signatureDataUrl,
      clientIp: clientIp(req),
    });
    if (!ok) return NextResponse.json({ error: "Could not save signature" }, { status: 409 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "Failed to sign";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
