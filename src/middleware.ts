import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { defaultLocale, isAppLocale, type AppLocale } from "../i18n/locales";

const LOCALE_COOKIE = "locale";

function pickLocale(accept: string | null): AppLocale {
  if (!accept) return defaultLocale;
  for (const part of accept.split(",")) {
    const tag = (part.split(";")[0]?.trim() ?? "").toLowerCase();
    if (!tag) continue;
    const primary = tag.split("-")[0] ?? "";
    if (primary === "es" || tag.startsWith("es-")) return "es";
    if (primary === "en" || tag.startsWith("en-")) return "en";
    if (isAppLocale(primary)) return primary;
  }
  return defaultLocale;
}

/** Sets `locale` cookie from Accept-Language on first visit so the site matches the device language. */
export function middleware(request: NextRequest) {
  const existing = request.cookies.get(LOCALE_COOKIE)?.value;
  if (existing && isAppLocale(existing)) {
    return NextResponse.next();
  }
  const best = pickLocale(request.headers.get("accept-language"));
  const res = NextResponse.next();
  res.cookies.set(LOCALE_COOKIE, best, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
