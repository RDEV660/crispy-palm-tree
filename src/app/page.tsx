import { HeroBackdrop } from "@/components/HeroBackdrop";
import { LanguageToggle } from "@/components/LanguageToggle";
import { SocialLinks } from "@/components/SocialLinks";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { ANIMATION_GALLERY } from "@/data/animation-gallery";
import { HOME_HERO_SLIDES } from "@/data/home-hero-slides";
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
    <div className="flex flex-1 flex-col bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-2xl bg-zinc-900 shadow-sm ring-1 ring-zinc-700/80">
              <Image
                src="/ohana-logo-v2.png"
                alt={`${tBrand("name")} logo`}
                width={36}
                height={36}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="text-sm font-semibold text-zinc-50">{tBrand("name")}</div>
              <div className="line-clamp-2 text-[11px] text-zinc-400 sm:line-clamp-none sm:text-xs">{tBrand("tagline")}</div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <WhatsAppCTA className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-emerald-500/30 transition hover:bg-emerald-500" />
            </div>
            {/* Socials: desktop header only — mobile uses footer to avoid triple duplicate with hero */}
            <SocialLinks variant="onDark" className="hidden sm:flex flex-wrap items-center gap-2" />
            <LanguageToggle variant="onDark" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12 pt-8 sm:py-14">
        <section className="relative min-h-[min(62vh,560px)] overflow-hidden rounded-3xl bg-black shadow-lg ring-1 ring-emerald-900/30 sm:min-h-[min(78vh,820px)] sm:min-h-[560px]">
          <HeroBackdrop videoLabel={tHome("heroVideoLabel")} />
          <div className="relative z-10 flex min-h-[min(62vh,560px)] flex-col justify-end p-5 pb-6 sm:min-h-[min(78vh,820px)] sm:min-h-[560px] sm:p-10">
            <div className="max-w-xl rounded-3xl border border-emerald-500/25 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-md ring-1 ring-black/40">
              <div className="grid gap-4">
                <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] sm:text-5xl">
                  {tHome("heroTitle")}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-zinc-100/95 sm:text-lg">{tHome("heroSubtitle")}</p>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <WhatsAppCTA className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-emerald-400/40 transition hover:bg-emerald-400 sm:w-auto" />
                <div className="text-sm text-zinc-200">
                  <span className="font-medium text-white">{tCommon("phone")}:</span> (956) 703-2804
                </div>
                {/* Follow us: tablet+ only — footer has socials on mobile */}
                <div className="hidden sm:flex sm:items-center sm:gap-2">
                  <span className="text-xs font-semibold text-zinc-300">{tCommon("followUs")}</span>
                  <SocialLinks variant="onDark" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-black/50 p-4 ring-1 ring-zinc-700/80 backdrop-blur-sm">
                  <div className="text-xs font-semibold text-zinc-400">{tCommon("serviceArea")}</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-50">{tCommon("serviceAreaValue")}</div>
                </div>
                <div className="rounded-2xl bg-black/50 p-4 ring-1 ring-zinc-700/80 backdrop-blur-sm">
                  <div className="text-xs font-semibold text-zinc-400">{tHome("servicesTitle")}</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-50">{tHome("heroHighlights.servicesBlurb")}</div>
                </div>
                <div className="rounded-2xl bg-black/50 p-4 ring-1 ring-zinc-700/80 backdrop-blur-sm">
                  <div className="text-xs font-semibold text-zinc-400">{tHome("heroHighlights.whatsappTitle")}</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-50">{tHome("heroHighlights.whatsappBlurb")}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 sm:mt-14">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight text-zinc-50 sm:text-2xl">{tHome("servicesTitle")}</h2>
            <div className="hidden sm:block">
              <WhatsAppCTA className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-emerald-500/30 transition hover:bg-emerald-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-3xl bg-zinc-900/90 p-5 shadow-sm ring-1 ring-zinc-700/80"
              >
                <div className="text-base font-semibold text-zinc-50">{s.title}</div>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 sm:mt-14">
          <div className="mb-4">
            <h2 className="text-xl font-bold tracking-tight text-zinc-50 sm:text-2xl">{tHome("animationsSectionTitle")}</h2>
            <p className="mt-1 text-sm font-medium text-emerald-400/90">{tHome("animationsSectionSubtitle")}</p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">{tHome("animationsIntro")}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 sm:gap-3">
            {ANIMATION_GALLERY.map((src) => (
              <div
                key={src}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-zinc-700/80"
              >
                <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 640px) 50vw, 20vw" />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 sm:mt-14">
          <div className="mb-3">
            <h2 className="text-xl font-bold tracking-tight text-zinc-50 sm:text-2xl">{tHome("galleryTitle")}</h2>
            <p className="mt-1 text-sm text-zinc-400">{tHome("gallerySubtitle")}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {HOME_HERO_SLIDES.map((src) => (
              <div
                key={src}
                className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-zinc-700/80"
              >
                <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 640px) 50vw, 33vw" />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 sm:mt-14">
          <div className="rounded-3xl border border-emerald-900/40 bg-zinc-900 px-5 py-7 text-zinc-50 shadow-lg ring-1 ring-zinc-800/80 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
              <div className="min-w-0 flex-1">
                <div className="text-lg font-bold text-zinc-50">{tHome("footerCTA")}</div>
                <div className="mt-1 text-sm text-zinc-400">{tCommon("phone")}: (956) 703-2804</div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-400">{tCommon("followUs")}</span>
                  <SocialLinks variant="onDark" />
                </div>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[220px] sm:items-stretch">
                <WhatsAppCTA className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-emerald-500/30 transition hover:bg-emerald-500" />
                <Link
                  href="/admin/login"
                  className="inline-flex w-full items-center justify-center rounded-full border border-zinc-600 bg-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-700"
                >
                  {tHome("ownerDashboard")}
                </Link>
                <div className="text-center text-xs text-zinc-500 sm:text-right">{tHome("ownerDashboardHint")}</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
