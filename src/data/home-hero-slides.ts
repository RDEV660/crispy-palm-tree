/** Real Ohana photos used on the homepage hero + gallery (served from /public/hero). */
export const HOME_HERO_SLIDES = [
  "/hero/home-03.png",
  "/hero/home-04.png",
  "/hero/home-05.png",
  "/hero/home-06.png",
  "/hero/home-07.png",
  "/hero/home-08.png",
  "/hero/home-09.png",
  "/hero/home-10.png",
  "/hero/home-11.png",
] as const;

export type HomeHeroSlide = (typeof HOME_HERO_SLIDES)[number];
