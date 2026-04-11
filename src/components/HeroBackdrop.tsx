"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HOME_HERO_SLIDES } from "@/data/home-hero-slides";

type Props = {
  videoLabel: string;
};

const SLIDE_INTERVAL_MS = 4500;

export function HeroBackdrop({ videoLabel }: Props) {
  const slides = HOME_HERO_SLIDES;
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
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [slides.length, reduceMotion]);

  const customVideo = process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim();
  const showVideo = Boolean(customVideo) && !reduceMotion;
  const videoSources = customVideo
    ? [{ src: customVideo, type: customVideo.endsWith(".webm") ? "video/webm" : "video/mp4" }]
    : [];

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-3xl" aria-hidden>
      <div className="absolute inset-0 bg-zinc-950" />

      <div className="absolute inset-0">
        {slides.map((src, i) => (
          <div key={src} className="absolute inset-0">
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              className={`object-cover transition-[opacity,transform] duration-[1600ms] ease-out ${
                i === index
                  ? "opacity-[0.62] scale-100 saturate-[1.08] contrast-[1.03]"
                  : "opacity-0 scale-[1.03]"
              }`}
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {showVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-soft-light"
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

      <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/55 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.35)]" />
    </div>
  );
}
