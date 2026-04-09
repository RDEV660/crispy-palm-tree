import { NextResponse } from "next/server";
import { getContractByPublicId } from "@/lib/contracts/repo";
import { buildContractPdf } from "@/lib/pdf/contract-pdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ publicId: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { publicId } = await ctx.params;
  if (!publicId || publicId.length > 64) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
  try {
    const row = await getContractByPublicId(publicId);
    if (!row || row.status !== "completed") {
      return NextResponse.json({ error: "Not available" }, { status: 404 });
    }
    const bytes = await buildContractPdf(row);
    const short = publicId.replace(/-/g, "").slice(0, 8);
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ohana-events-contract-${short}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "PDF failed" }, { status: 500 });
  }
}
