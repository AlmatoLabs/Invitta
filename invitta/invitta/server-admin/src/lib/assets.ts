// Static images live in /public/images and are referenced by URL, so the strings stored in an
// invitation's content stay valid across builds.
export const IMG = {
  hero: "/images/hero.jpg",
  heroCouple: "/images/hero-couple.jpg",
  floral: "/images/template-floral.jpg",
  ivory: "/images/template-ivory.jpg",
  modern: "/images/template-modern.jpg",
  italian: "/images/template-italian.jpg",
  blacktie: "/images/template-blacktie.jpg",
  tplMinimalIvory: "/images/tpl-minimal-ivory.jpg",
  tplItalianRomance: "/images/tpl-italian-romance.jpg",
} as const;

/** Cover image per collection model. */
export const MODEL_IMAGES: Record<string, string> = {
  "minimal-ivory": IMG.tplMinimalIvory,
  "italian-romance": IMG.tplItalianRomance,
  "black-tie": IMG.blacktie,
  "floral-beige": IMG.floral,
};

/** Images offered in the editor's gallery picker. */
export const GALLERY = [IMG.hero, IMG.floral, IMG.ivory, IMG.modern, IMG.italian, IMG.blacktie];
