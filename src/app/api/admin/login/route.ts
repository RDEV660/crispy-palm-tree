import { NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/auth/password";
import { signAdminSessionJwt } from "@/lib/auth/session";
import { SESSION_COOKIE_NAME } from "@/lib/contracts/constants";
import { loadDevVarsIntoProcessEnv } from "@/lib/load-dev-vars";

export const runtime = "nodejs";

export async function POST(req: Request) {
  loadDevVarsIntoProcessEnv();
  let body: { password?: string };
  try {
    body = (await req.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const password = body.password ?? "";
  const ok = await verifyAdminPassword(password);
  if (!ok) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  let token: string;
  try {
    token = await signAdminSessionJwt();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Session signing failed";
    console.error("[admin/login]", msg);
    return NextResponse.json(
      {
        error:
          "Server configuration error. Set CONTRACT_SESSION_SECRET in Vercel (16+ characters), redeploy, and try again.",
        detail: process.env.NODE_ENV === "development" ? msg : undefined,
      },
      { status: 500 }
    );
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
