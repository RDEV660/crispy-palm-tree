"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/** Ohana Events promo flyers — files in /public/hero/ */
const DEFAULT_SLIDES = [
  "/hero/slide-01.png",
  "/hero/slide-02.png",
  "/hero/slide-03.png",
  "/hero/slide-04.png",
  "/hero/slide-05.png",
  "/hero/slide-06.png",
  "/hero/slide-07.png",
];

/** CC0 sample — set `NEXT_PUBLIC_HERO_VIDEO_URL` to your own file or CDN URL */
const DEFAULT_VIDEO_SOURCES: { src: string; type: string }[] = [
  {
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
    type: "video/webm",
  },
];

type Props = {
  imageUrls?: string[];
  videoLabel: string;
};

export function HeroBackdrop({ imageUrls, videoLabel }: Props) {
  const slides = imageUrls?.length ? imageUrls : DEFAULT_SLIDES;
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(t);
  }, [slides.length, reduceMotion]);

  const customVideo = process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim();
  const videoSources = customVideo
    ? [{ src: customVideo, type: customVideo.endsWith(".webm") ? "video/webm" : "video/mp4" }]
    : DEFAULT_VIDEO_SOURCES;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-3xl" aria-hidden>
      <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-950" />

      <div className="absolute inset-0">
        {slides.map((src, i) => (
          <div key={src} className="absolute inset-0">
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className={`object-cover transition-opacity duration-[1400ms] ease-in-out ${
                // Make the slideshow clearly visible (previously too subtle under the gradient)
                i === index ? "opacity-[0.70] dark:opacity-[0.55]" : "opacity-0"
              }`}
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {!reduceMotion && (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-12 mix-blend-multiply dark:opacity-18 dark:mix-blend-soft-light"
          autoPlay
          muted
          loop
          playsInline
          aria-label={videoLabel}
        >
          {videoSources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      )}

      {/* Lighter overlay so the flyers are visible behind the hero content */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/45 to-white/55 dark:from-zinc-950/55 dark:via-zinc-950/65 dark:to-zinc-950/75" />
    </div>
  );
}
