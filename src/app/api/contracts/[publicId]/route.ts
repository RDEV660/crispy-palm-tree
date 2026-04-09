import { NextResponse } from "next/server";
import { getContractByPublicId } from "@/lib/contracts/repo";
import { toPublicContractJson } from "@/lib/contracts/public-view";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ publicId: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { publicId } = await ctx.params;
  if (!publicId || publicId.length > 64) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
  try {
    const row = await getContractByPublicId(publicId);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const view = toPublicContractJson(row);
    if (!view) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(view);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}
