"use client";

import { useTranslations } from "next-intl";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function StickyWhatsAppButton() {
  const tCommon = useTranslations("Common");
  const tWa = useTranslations("WhatsApp");

  const href = buildWhatsAppLink(tWa("prefill"));

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:hidden">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-zinc-900/10 transition hover:bg-zinc-800 active:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
        aria-label={tCommon("chatOnWhatsApp")}
      >
        {tCommon("chatOnWhatsApp")}
      </a>
      <div className="pointer-events-none h-2" />
    </div>
  );
}

