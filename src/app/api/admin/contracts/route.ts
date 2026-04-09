import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin-session";
import { insertContract, listContracts, rowPayload } from "@/lib/contracts/repo";
import { contractPayloadSchema, defaultPayload } from "@/lib/contracts/schema";
import { LEGAL_VERSION } from "@/lib/contracts/constants";
import { isAppLocale } from "../../../../../i18n/locales";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdminSession();
  if (denied) return denied;
  try {
    const rows = await listContracts();
    const list = rows.map((r) => {
      const p = rowPayload(r);
      return {
        id: r.id,
        publicId: r.public_id,
        status: r.status,
        locale: r.locale,
        clientName: p.clientName,
        eventDate: p.eventDate,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      };
    });
    return NextResponse.json({ contracts: list });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load contracts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const denied = await requireAdminSession();
  if (denied) return denied;
  try {
    const body = (await req.json()) as { locale?: string; payload?: unknown };
    const locale = isAppLocale(body.locale) ? body.locale : "en";
    const payload = body.payload
      ? contractPayloadSchema.parse(body.payload)
      : defaultPayload();

    const created = await insertContract({
      locale,
      legalVersion: LEGAL_VERSION,
      payload,
    });
    return NextResponse.json(created);
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "Failed to create";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
