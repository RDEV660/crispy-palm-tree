"use client";

import { useTranslations } from "next-intl";

const INSTAGRAM_HREF = "https://www.instagram.com/ohanaevents.1/";
const TIKTOK_HREF = "https://www.tiktok.com/@ohana.events6";

type Props = {
  className?: string;
  variant?: "default" | "onDark";
};

export function SocialLinks({ className, variant = "default" }: Props) {
  const t = useTranslations("Common");

  const baseLink =
    variant === "onDark"
      ? "inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/15 dark:bg-zinc-100 dark:text-zinc-800 dark:ring-zinc-200/80 dark:hover:bg-white dark:hover:ring-zinc-300"
      : "inline-flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-800 ring-1 ring-zinc-200/80 transition hover:bg-white hover:ring-zinc-300 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-white/10 dark:hover:bg-zinc-800";

  return (
    <div className={className ?? "flex flex-wrap items-center gap-2"}>
      <a
        href={INSTAGRAM_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className={baseLink}
        aria-label={t("instagramAria")}
      >
        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </a>
      <a
        href={TIKTOK_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className={baseLink}
        aria-label={t("tiktokAria")}
      >
        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64v-3.5a6.33 6.33 0 0 0-1-.1A6.34 6.34 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      </a>
    </div>
  );
}
