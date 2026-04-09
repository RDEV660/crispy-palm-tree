import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/contracts/constants";
import { verifyAdminSessionJwt } from "./session";

/** Use in Route Handlers (Node) where full session secret is available — not in Edge middleware. */
export async function requireAdminSession(): Promise<NextResponse | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE_NAME)?.value;
  if (!(await verifyAdminSessionJwt(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
