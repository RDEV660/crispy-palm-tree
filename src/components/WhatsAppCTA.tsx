"use client";

import { useTranslations } from "next-intl";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type Props = {
  className?: string;
};

export function WhatsAppCTA({ className }: Props) {
  const tCommon = useTranslations("Common");
  const tWa = useTranslations("WhatsApp");

  const href = buildWhatsAppLink(tWa("prefill"));

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-zinc-900/10 transition hover:bg-zinc-800 active:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
      }
      aria-label={tCommon("chatOnWhatsApp")}
    >
      {tCommon("chatOnWhatsApp")}
    </a>
  );
}

