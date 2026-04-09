export const locales = ["en", "es"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  if (!value) return false;
  return (locales as readonly string[]).includes(value);
}

