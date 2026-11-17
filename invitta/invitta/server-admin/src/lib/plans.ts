/** Pricing plans shown on the home page and summarised on /register (?plan=<slug>). */
export type Plan = {
  slug: "basic" | "premium" | "luxury";
  name: string;
  /** Price in EUR, one-time payment. */
  price: number;
  desc: string;
  featured?: boolean;
  /** "Tot din <plan>, plus:" — the plan whose features this one includes. */
  includes?: string;
  /** Same order on every card: designs, guests, then what this plan adds. */
  features: string[];
};

// TODO(prețuri): confirmați dacă prețurile includ TVA și afișați mențiunea sub preț.
export const PLANS: Plan[] = [
  { slug: "basic", name: "Basic", price: 0, desc: "Pentru a începe", features: ["1 design", "50 invitați", "RSVP de bază", "Link personalizat"] },
  {
    slug: "premium",
    name: "Premium",
    price: 129,
    desc: "Experiența completă",
    featured: true,
    includes: "Basic",
    features: ["Toate design-urile", "200 invitați", "Aranjare la mese", "Galerie foto", "Suport prioritar"],
  },
  {
    slug: "luxury",
    name: "Luxury",
    price: 249,
    desc: "Fără limite",
    includes: "Premium",
    features: ["Invitați nelimitați", "Domeniu propriu", "Personalizare completă", "Designer dedicat", "Muzică & video"],
  },
];

export function findPlan(slug: string | null | undefined): Plan | undefined {
  return PLANS.find((p) => p.slug === slug);
}
