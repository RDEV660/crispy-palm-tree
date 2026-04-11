"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

type LocaleOption = { value: "en" | "es"; label: string };

const LOCALE_COOKIE = "locale";

function setLocaleCookie(locale: "en" | "es") {
  const oneYearSeconds = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${oneYearSeconds}; SameSite=Lax`;
}

type Props = {
  /** For dark page backgrounds (e.g. marketing home). */
  variant?: "default" | "onDark";
};

export function LanguageToggle({ variant = "default" }: Props) {
  const t = useTranslations("Common");
  const locale = useLocale() as "en" | "es";
  const onDark = variant === "onDark";

  const options: LocaleOption[] = useMemo(
    () => [
      { value: "en", label: t("english") },
      { value: "es", label: t("spanish") },
    ],
    [t]
  );

  const [value, setValue] = useState<"en" | "es">(locale);

  return (
    <label
      className={
        onDark
          ? "inline-flex items-center gap-2 text-sm text-zinc-300"
          : "inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200"
      }
    >
      <span className="hidden sm:inline">{t("language")}</span>
      <select
        value={value}
        onChange={(e) => {
          const next = e.target.value as "en" | "es";
          setValue(next);
          setLocaleCookie(next);
          window.location.reload();
        }}
        className={
          onDark
            ? "rounded-full border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 shadow-sm outline-none hover:bg-zinc-700 focus:ring-2 focus:ring-emerald-500/30"
            : "rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 shadow-sm outline-none hover:bg-zinc-50 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
        }
        aria-label={t("language")}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

