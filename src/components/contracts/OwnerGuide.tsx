import { getTranslations } from "next-intl/server";

type Props = { variant?: "card" | "compact" };

export async function OwnerGuide({ variant = "card" }: Props) {
  const t = await getTranslations("OwnerGuide");

  if (variant === "compact") {
    return (
      <aside
        className="mb-8 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 text-sm text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100"
        aria-label={t("compactAria")}
      >
        <p className="font-semibold text-emerald-900 dark:text-emerald-50">{t("compactTitle")}</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-emerald-900/90 dark:text-emerald-100/90">
          <li>{t("step1Short")}</li>
          <li>{t("step2Short")}</li>
          <li>{t("step3Short")}</li>
          <li>{t("step4Short")}</li>
        </ol>
      </aside>
    );
  }

  return (
    <section
      className="mb-8 rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-6 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900"
      aria-labelledby="owner-guide-heading"
    >
      <h2 id="owner-guide-heading" className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {t("title")}
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t("intro")}</p>
      <ol className="mt-4 space-y-4 text-sm">
        <li className="flex gap-3">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900"
            aria-hidden
          >
            1
          </span>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{t("step1Title")}</p>
            <p className="mt-0.5 text-zinc-600 dark:text-zinc-400">{t("step1Body")}</p>
          </div>
        </li>
        <li className="flex gap-3">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900"
            aria-hidden
          >
            2
          </span>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{t("step2Title")}</p>
            <p className="mt-0.5 text-zinc-600 dark:text-zinc-400">{t("step2Body")}</p>
          </div>
        </li>
        <li className="flex gap-3">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900"
            aria-hidden
          >
            3
          </span>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{t("step3Title")}</p>
            <p className="mt-0.5 text-zinc-600 dark:text-zinc-400">{t("step3Body")}</p>
          </div>
        </li>
        <li className="flex gap-3">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900"
            aria-hidden
          >
            4
          </span>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{t("step4Title")}</p>
            <p className="mt-0.5 text-zinc-600 dark:text-zinc-400">{t("step4Body")}</p>
          </div>
        </li>
      </ol>
    </section>
  );
}
