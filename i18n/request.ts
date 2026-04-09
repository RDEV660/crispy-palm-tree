import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isAppLocale, type AppLocale } from "./locales";

const LOCALE_COOKIE = "locale";

function parseAcceptLanguage(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .map((part) => part.split(";")[0]?.trim())
    .filter(Boolean);
}

function normalizeToAppLocale(tag: string): AppLocale | null {
  const lower = tag.toLowerCase();
  const primary = lower.split("-")[0];
  if (isAppLocale(primary)) return primary;
  if (isAppLocale(lower)) return lower as AppLocale;
  return null;
}

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  const headerLocale = normalizeToAppLocale(
    parseAcceptLanguage((await headers()).get("accept-language"))[0] ?? ""
  );

  const locale: AppLocale =
    (isAppLocale(cookieLocale) ? cookieLocale : null) ?? headerLocale ?? defaultLocale;

  const messages = (await import(`../messages/${locale}.json`)).default;

  return { locale, messages };
});

