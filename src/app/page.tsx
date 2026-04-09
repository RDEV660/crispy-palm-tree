import { HeroBackdrop } from "@/components/HeroBackdrop";
import { LanguageToggle } from "@/components/LanguageToggle";
import { SocialLinks } from "@/components/SocialLinks";
import { StickyWhatsAppButton } from "@/components/StickyWhatsAppButton";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const tBrand = useTranslations("Brand");
  const tCommon = useTranslations("Common");
  const tHome = useTranslations("Home");

  const services = [
    {
      title: tHome("services.snackFruit.title"),
      desc: tHome("services.snackFruit.desc"),
    },
    {
      title: tHome("services.snackCorn.title"),
      desc: tHome("services.snackCorn.desc"),
    },
    {
      title: tHome("services.snackChips.title"),
      desc: tHome("services.snackChips.desc"),
    },
    {
      title: tHome("services.freshWaters.title"),
      desc: tHome("services.freshWaters.desc"),
    },
    {
      title: tHome("services.babyShower.title"),
      desc: tHome("services.babyShower.desc"),
    },
    {
      title: tHome("services.characters.title"),
      desc: tHome("services.characters.desc"),
    },
  ];

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <header className="sticky top-0 z-40 border-b border-zinc-200/60 bg-zinc-50/80 backdrop-blur dark:border-zinc-800/60 dark:bg-black/60">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-900/5 dark:bg-zinc-950 dark:ring-white/10">
              <Image
                src="/ohana-logo-v2.png"
                alt={`${tBrand("name")} logo`}
                width={36}
                height={36}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">{tBrand("name")}</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">{tBrand("tagline")}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <WhatsAppCTA />
            </div>
            <SocialLinks />
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:py-14">
        <section className="relative grid gap-8 overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 dark:bg-zinc-950 dark:ring-white/10 sm:p-10">
          <HeroBackdrop videoLabel={tHome("heroVideoLabel")} />
          <div className="relative z-10 grid gap-8">
            <div className="grid gap-4">
              <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-sm sm:text-5xl">
                {tHome("heroTitle")}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-800 dark:text-zinc-200 sm:text-lg">
                {tHome("heroSubtitle")}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
              <WhatsAppCTA className="w-full sm:w-auto" />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="text-sm text-zinc-700 dark:text-zinc-300">
                  <span className="font-medium">{tCommon("phone")}:</span> (956) 703-2804
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    {tCommon("followUs")}
                  </span>
                  <SocialLinks />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-zinc-200/80 backdrop-blur-sm dark:bg-zinc-900/70 dark:ring-zinc-800">
                <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{tCommon("serviceArea")}</div>
                <div className="mt-1 text-sm font-semibold">{tCommon("serviceAreaValue")}</div>
              </div>
              <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-zinc-200/80 backdrop-blur-sm dark:bg-zinc-900/70 dark:ring-zinc-800">
                <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{tHome("servicesTitle")}</div>
                <div className="mt-1 text-sm font-semibold">Snack carts • Decor • Themes</div>
              </div>
              <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-zinc-200/80 backdrop-blur-sm dark:bg-zinc-900/70 dark:ring-zinc-800">
                <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">WhatsApp</div>
                <div className="mt-1 text-sm font-semibold">Fast quotes & availability</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 sm:mt-14">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{tHome("servicesTitle")}</h2>
            <div className="hidden sm:block">
              <WhatsAppCTA />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-zinc-900/5 dark:bg-zinc-950 dark:ring-white/10"
              >
                <div className="text-base font-semibold">{s.title}</div>
                <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 sm:mt-14">
          <div className="mb-3">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{tHome("galleryTitle")}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{tHome("gallerySubtitle")}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-3xl bg-gradient-to-br from-orange-200 via-pink-200 to-emerald-200 ring-1 ring-zinc-900/5 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 dark:ring-white/10"
              />
            ))}
          </div>
        </section>

        <section className="mt-10 sm:mt-14">
          <div className="rounded-3xl bg-zinc-900 px-6 py-8 text-white shadow-sm ring-1 ring-zinc-900/10 dark:bg-white dark:text-zinc-950">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="text-lg font-bold">{tHome("footerCTA")}</div>
                <div className="mt-1 text-sm opacity-80">{tCommon("phone")}: (956) 703-2804</div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold opacity-80">{tCommon("followUs")}</span>
                  <SocialLinks variant="onDark" />
                </div>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
                <WhatsAppCTA className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 shadow-sm ring-1 ring-white/10 transition hover:bg-zinc-100 active:bg-white dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900 sm:w-auto" />
                <Link
                  href="/admin/contracts"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 dark:border-zinc-950/20 dark:bg-zinc-950/10 dark:text-zinc-950 dark:hover:bg-zinc-950/15 sm:w-auto"
                >
                  {tHome("ownerDashboard")}
                </Link>
                <div className="text-center text-xs text-white/70 dark:text-zinc-950/70 sm:text-right">
                  {tHome("ownerDashboardHint")}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <StickyWhatsAppButton />
    </div>
  );
}
