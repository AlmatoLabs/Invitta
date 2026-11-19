import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { IMG } from "@/lib/assets";
import type { Metadata } from "next";
import { PhoneMockup } from "@/components/PhoneMockup";
import { InvitationPreview } from "@/components/InvitationPreview";
import { MobileCreateCta } from "@/components/MobileCreateCta";
import { PLANS } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Invitta RSVP — Invitații digitale de nuntă, create cu eleganță",
  description:
    "Povestea voastră merită o invitație pe măsură. Invitații digitale elegante, confirmări RSVP și aranjarea meselor, într-un singur loc.",
  openGraph: {
    title: "Invitta RSVP — Invitații digitale de nuntă",
    description: "Invitații digitale create cu eleganță. Momente speciale, împărtășite cu cei dragi.",
    type: "website",
    images: [IMG.heroCouple],
  },
  twitter: { card: "summary_large_image", images: [IMG.heroCouple] },
};

const featured = [
  { name: "Minimal Ivory", slug: "minimal-ivory", img: IMG.tplMinimalIvory, no: "I", mood: "Pur · Atemporal", color: true },
  { name: "Italian Romance", slug: "italian-romance", img: IMG.tplItalianRomance, no: "II", mood: "Cald · Toscan", color: true },
  { name: "Black Tie", slug: "black-tie", img: IMG.blacktie, no: "III", mood: "Sofisticat · Nocturn", color: false },
  { name: "Floral Beige", slug: "floral-beige", img: IMG.floral, no: "IV", mood: "Romantic · Delicat", color: false },
];

const steps = [
  { n: "01", title: "Alege un design", desc: "Selectează din colecția noastră de invitații editoriale, creată cu grijă." },
  { n: "02", title: "Trimite invitația", desc: "Distribuie linkul personalizat prin WhatsApp, e-mail sau social media." },
  { n: "03", title: "Primește confirmările", desc: "Vezi toate răspunsurile într-un singur loc, elegant și simplu." },
];

const features = [
  { title: "Invitație online", desc: "Pagina ta personalizată, mereu disponibilă." },
  { title: "Confirmări RSVP", desc: "Răspunsurile invitaților, ordonate frumos." },
  { title: "Aranjare la mese", desc: "Drag & drop intuitiv, vizual și satisfăcător." },
  { title: "Guest list elegant", desc: "Listă completă cu preferințe și mesaje." },
  { title: "Link personalizat", desc: "invitta.ro/ioana-andrei — simplu, memorabil." },
];

const testimonials = [
  { name: "Ana & Mihai", text: "Invitația noastră a primit atâtea complimente. Totul a fost extrem de simplu și elegant.", date: "Mai 2025" },
  { name: "Ioana & Răzvan", text: "Am organizat 180 de invitați fără stres. Funcția de aranjare a meselor e magică.", date: "August 2025" },
  { name: "Diana & Cristian", text: "Pur și simplu frumos. Părea că am angajat un designer doar pentru noi.", date: "Iulie 2025" },
];

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`eyebrow text-liliac-600 ${className}`}>{children}</p>;
}

/* Link-buton text (Demo, Vezi toate modelele): 14px, sentence case, fără tracking. */
const textLink = "inline-flex min-h-8 items-center gap-3 text-[14px] font-medium text-liliac-600 transition-colors duration-150 hover:text-liliac-700";
const textLinkLine = "border-b border-liliac-600/40 pb-1 transition-colors duration-150";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <img
          src={IMG.heroCouple}
          alt="Mirele și mireasa mergând pe o alee, mireasa privind peste umăr"
          width={735}
          height={528}
          className="absolute inset-0 h-full w-full object-cover object-[76%_18%] sm:object-center animate-[invitta-reveal_1.6s_ease-out_both]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background from-40% via-background/90 via-60% to-transparent sm:bg-gradient-to-r sm:from-35% sm:via-background/85 sm:via-55% sm:to-transparent sm:to-85%" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-6 pb-16 pt-32 md:justify-center md:pb-0">
          <div className="max-w-xl animate-fade-up">
            <Label>Atelier de invitații digitale</Label>
            <h1 className="mt-8 font-serif text-5xl font-light leading-[1.1] text-foreground sm:text-6xl lg:text-[5.5rem]">
              Povestea voastră merită o invitație <em className="text-liliac-600">pe măsură.</em>
            </h1>
            <div className="mt-8 h-px w-16 bg-liliac" />
            <p className="mt-8 max-w-sm text-lg text-foreground">
              Invitații digitale create cu eleganță. Momente speciale, împărtășite cu cei dragi.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a href="#colectii" className="rounded-[4px] bg-primary px-8 py-4 text-base text-primary-foreground transition-colors duration-150 hover:bg-primary-hover">
                Descoperă colecțiile
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section id="templates" className="mx-auto max-w-[1400px] px-6 py-28 md:py-36">
        <div id="colectii" className="grid gap-x-12 gap-y-6 sm:grid-cols-2 sm:items-end">
          <div>
            <Label>Colecția 2026</Label>
            <h2 className="mt-5 font-serif text-4xl leading-[1.12] text-foreground lg:text-6xl lg:font-light">
              <span className="block">O colecție</span>
              <em className="block">pentru fiecare poveste</em>
            </h2>
          </div>
          <p className="max-w-md text-base text-foreground">
            Fiecare design este compus ca o papetărie de nuntă — tipografie atentă, ritm și liniște.
          </p>
        </div>
        <div className="mt-6">
          <Link href="/modele" className={`group/all ${textLink}`}>
            <span className={`${textLinkLine} group-hover/all:border-liliac-700`}>
              Vezi toate modelele
            </span>
            <span aria-hidden="true" className="transition-transform duration-500 group-hover/all:translate-x-1">→</span>
          </Link>
        </div>

        <div className="mt-12 grid items-start gap-x-12 gap-y-16 sm:grid-cols-2">
          {featured.map((t, index) => (
            <figure key={t.name} className={`group min-w-0 ${index % 2 === 1 ? "sm:mt-16" : ""}`}>
              <Link href={`/invitatie/${t.slug}`} aria-label={`Vezi invitația ${t.name}`} className="block overflow-hidden rounded-[4px] bg-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                <img
                  src={t.img}
                  alt={`Invitația ${t.name}`}
                  loading="lazy"
                  width={800}
                  height={1200}
                  className={`aspect-[5/4] w-full object-cover ${t.color ? "" : "grayscale "}transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03] group-focus-within:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none`}
                />
              </Link>
              <figcaption className="mt-7 border-b border-border pb-10">
                <div className="flex items-baseline justify-between gap-4">
                  <Link href={`/invitatie/${t.slug}`} className="min-w-0 font-serif text-[28px] leading-tight text-foreground decoration-1 underline-offset-8 transition-colors duration-150 hover:text-liliac-600 group-hover:underline focus-visible:underline">{t.name}</Link>
                  <span aria-hidden="true" className="shrink-0 font-serif text-3xl italic text-liliac-600">{t.no}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{t.mood}</p>
                <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Link href={`/invitatie/${t.slug}`} className={`group/demo ${textLink}`}>
                    <span className={`${textLinkLine} group-hover/demo:border-liliac-700`}>
                      Demo
                    </span>
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover/demo:translate-x-1">→</span>
                  </Link>
                  <Link
                    href={`/register?design=${t.slug}`}
                    className="inline-flex min-h-11 items-center rounded-[4px] border border-liliac-600 px-6 py-2.5 text-[14px] font-medium text-liliac-700 transition-colors duration-150 hover:border-primary-hover hover:bg-primary-hover hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    Alege invitația
                  </Link>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

      </section>

      {/* STATEMENT */}
      <section className="bg-secondary py-28 md:py-40">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-serif text-4xl leading-[1.15] sm:text-6xl sm:font-light">
            Nu doar o invitație. <em className="text-liliac-600">Primul capitol</em> al zilei voastre.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="text-center">
          <Label>Cum funcționează</Label>
          <h2 className="mt-5 font-serif text-4xl sm:text-5xl sm:font-light">Trei pași simpli, fără efort</h2>
        </div>
        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="border-t border-border pt-6">
              <span className="font-serif text-3xl italic text-liliac-600">{s.n}</span>
              <h3 className="mt-4 font-serif text-2xl">{s.title}</h3>
              <p className="mt-3 text-base text-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES LIST */}
      <section className="border-y border-border">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Label>Tot ce ai nevoie</Label>
            <h2 className="mt-5 font-serif text-4xl leading-[1.12] sm:text-5xl sm:font-light">Doar esențialul, <em>gândit cu grijă</em>.</h2>
          </div>
          <ul>
            {features.map((f) => (
              <li key={f.title} className="group flex flex-col justify-between gap-2 border-b border-border py-5 transition-colors last:border-0 sm:flex-row sm:items-baseline">
                <span className="font-serif text-2xl transition-transform duration-500 group-hover:translate-x-1">{f.title}</span>
                <span className="text-base text-foreground">{f.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* STORY 1 — EDITOR */}
      <section id="features" className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-28 md:py-36 lg:grid-cols-[1.2fr_1fr]">
        <div aria-hidden="true" inert className="rounded-[4px] bg-secondary p-6 sm:p-10">
          <div className="grid overflow-hidden rounded-[4px] bg-card sm:grid-cols-[1fr_200px]">
            <div className="space-y-5 p-6 text-sm">
              <p className="text-xs font-medium text-muted-foreground">Editor · Informații</p>
              {[["Mireasa", "Ioana"], ["Mirele", "Andrei"], ["Data", "14 Iunie 2026"], ["Locația", "Domeniul Manasia"]].map(([l, v]) => (
                <div key={l} className="border-b border-border pb-3">
                  <p className="text-xs text-muted-foreground">{l}</p>
                  <p className="mt-1 text-base text-foreground">{v}</p>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                {/* Culorile unei invitații (șablon), nu ale aplicației → --tpl-* */}
                {["bg-tpl-ivory", "bg-tpl-beige", "bg-tpl-taupe", "bg-tpl-noir"].map((c) => (
                  <span key={c} className={`h-6 w-6 rounded-full border border-tpl-border ${c}`} />
                ))}
              </div>
            </div>
            <div className="hidden h-[340px] border-l border-border sm:block">
              <InvitationPreview compact />
            </div>
          </div>
        </div>
        <div>
          <Label>01 — Personal</Label>
          <h2 className="mt-5 font-serif text-4xl leading-[1.12] sm:text-5xl sm:font-light">Creează ceva <em>doar al vostru</em>.</h2>
          <p className="mt-6 max-w-md text-base text-foreground">
            Numele, data, locurile, povestea și fotografiile voastre. Schimbați orice și vedeți invitația prinzând viață în timp real.
          </p>
          <Link href="/register" className="mt-8 inline-block border-b border-foreground/40 pb-1 text-base text-foreground transition-colors duration-150 hover:border-liliac-600 hover:text-liliac-600">
            Începe personalizarea
          </Link>
        </div>
      </section>

      {/* FULL-WIDTH PHOTO */}
      <section className="relative h-[60vh] overflow-hidden">
        <img src={IMG.hero} alt="Buchet de bujori" loading="lazy" width={1280} height={1600} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/25" />
        {/* Scrim sub subtitlu: --ink 55% jos → transparent la ~40% din înălțime. Împreună cu
            pelicula ink/25, textul paper are ≥ 4.76:1 chiar și pe o imagine complet albă. */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[rgba(46,34,48,0.55)] from-55% to-transparent" />
        <p className="absolute bottom-10 left-6 font-serif text-3xl italic text-paper md:left-16 md:text-5xl md:font-light">Cu drag, pentru cei dragi.</p>
      </section>

      {/* STORY 2 — SHARE (DARK) */}
      <section className="bg-liliac-900 py-28 text-liliac-50 md:py-36">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <p className="eyebrow text-liliac-100">02 — Împărtășit</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.12] sm:text-5xl sm:font-light">Momentul vostru, <em className="text-liliac">în buzunarul fiecăruia</em>.</h2>
            <p className="mt-6 max-w-md text-base text-liliac-50">
              Un singur link, trimis pe WhatsApp. Invitații deschid invitația pe telefon și confirmă prezența în câteva secunde.
            </p>
            <Link
              href="/invitatie/ioana-andrei"
              className="mt-8 inline-block border-b border-liliac-100/50 pb-1 text-base text-liliac-50 transition-colors duration-150 hover:border-liliac-100 hover:text-liliac-100 focus-visible:outline-liliac-100"
            >
              Vezi o invitație demo
            </Link>
          </div>
          <div aria-hidden="true" inert className="order-1 flex justify-center gap-6 lg:order-2">
            <PhoneMockup>
              <InvitationPreview />
            </PhoneMockup>
            {/* Mockup de invitație (șablon) → --tpl-*, nu paleta aplicației */}
            <div className="tpl-scope hidden w-60 self-end rounded-[4px] bg-tpl-ivory p-6 text-tpl-noir sm:block">
              <p className="text-xs uppercase tracking-[0.3em] text-tpl-stone">Confirmare</p>
              <p className="mt-3 font-serif text-xl">Maria Popescu</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <span className="rounded-[4px] bg-tpl-noir px-3 py-2 text-center text-tpl-ivory">Particip</span>
                <span className="rounded-[4px] border border-tpl-border px-3 py-2 text-center text-tpl-stone">Nu particip</span>
              </div>
              <p className="mt-4 text-xs text-tpl-stone">2 persoane · Meniu clasic</p>
            </div>
          </div>
        </div>
      </section>

      {/* STORY 3 — MANAGE */}
      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-28 md:py-36 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <Label>03 — Liniștit</Label>
          <h2 className="mt-5 font-serif text-4xl leading-[1.12] sm:text-5xl sm:font-light">Sărbătoriți, <em>fără griji</em>.</h2>
          <p className="mt-6 max-w-md text-base text-foreground">
            Toate confirmările într-un singur loc. Așezați invitații la mese cu un simplu gest și vedeți imediat locurile libere.
          </p>
        </div>
        <div aria-hidden="true" inert className="rounded-[4px] bg-secondary p-6 sm:p-10">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[4px] bg-card p-5 text-sm">
              <p className="text-xs font-medium text-muted-foreground">Invitați</p>
              {([["Maria Popescu", "Confirmat", "bg-success-bg text-success"], ["Ion Ionescu", "În așteptare", "bg-warning-bg text-warning"], ["Elena Dima", "Confirmat", "bg-success-bg text-success"], ["Radu Stan", "Refuzat", "bg-danger-bg text-destructive"]] as const).map(([n, s, cls]) => (
                <div key={n} className="flex items-center justify-between gap-2 border-b border-border py-3 last:border-0">
                  <span>{n}</span>
                  <span className={`rounded-[4px] px-2 py-0.5 text-xs ${cls}`}>{s}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center rounded-[4px] bg-card p-5">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-liliac/60">
                <div className="text-center">
                  <p className="font-serif text-[22px]">Masa 1</p>
                  <p className="text-xs text-muted-foreground">8 / 10</p>
                </div>
                {Array.from({ length: 10 }).map((_, i) => (
                  <span
                    key={i}
                    className={`absolute h-3 w-3 rounded-full ${i < 8 ? "bg-liliac-600" : "border border-liliac bg-card"}`}
                    style={{ transform: `rotate(${i * 36}deg) translateY(-84px)` }}
                  />
                ))}
              </div>
              <p className="mt-6 text-xs text-muted-foreground">2 locuri libere</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="text-center">
          <Label>Povești adevărate</Label>
          <h2 className="mt-5 font-serif text-4xl sm:text-5xl sm:font-light">Iubit de cuplurile noastre</h2>
        </div>
        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="border-t border-border pt-6">
              <p className="font-serif text-2xl italic leading-[1.4]">„{t.text}”</p>
              <footer className="mt-6 flex justify-between gap-4 text-base">
                <span className="font-medium">{t.name}</span>
                <span className="text-sm text-muted-foreground">{t.date}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="border-t border-border bg-secondary py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <Label>Prețuri</Label>
            <h2 className="mt-5 font-serif text-4xl sm:text-5xl sm:font-light">Alege pachetul potrivit</h2>
            <p className="mt-4 text-base text-foreground">Plată unică. Fără abonament.</p>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-[4px] border border-border bg-border md:grid-cols-3">
            {PLANS.map((p) => (
              <div key={p.slug} className={`flex flex-col p-10 ${p.featured ? "bg-liliac-900 text-liliac-50" : "bg-card"}`}>
                {/* Rând de înălțime fixă pe toate cardurile, ca titlurile să rămână aliniate. */}
                <div className="mb-3 flex h-6 items-center">
                  {p.featured && (
                    <span className="rounded-full border border-liliac-100/60 px-2.5 py-0.5 text-xs font-medium text-liliac-100">Recomandat</span>
                  )}
                </div>
                <h3 className={`font-serif text-3xl ${p.featured ? "text-liliac" : ""}`}>{p.name}</h3>
                <p className={`mt-1 text-base ${p.featured ? "text-liliac-50" : "text-foreground"}`}>{p.desc}</p>
                <p className="mt-8 font-serif text-5xl font-light">€{p.price}</p>
                <ul className="mt-8 flex-1 space-y-3 text-base">
                  {p.includes && (
                    <li className={p.featured ? "text-liliac-100" : "text-foreground"}>Tot din {p.includes}, plus:</li>
                  )}
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span className="mt-2 h-px w-3 shrink-0 bg-liliac" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/register?plan=${p.slug}`}
                  className={`mt-10 block rounded-[4px] border px-6 py-3.5 text-center text-base transition-colors duration-150 ${p.featured ? "border-transparent bg-liliac-50 text-liliac-900 hover:bg-liliac-100 focus-visible:outline-liliac-100" : "border-liliac-600 text-liliac-700 hover:border-liliac-700 hover:bg-liliac-50"}`}
                >
                  Alege {p.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="mx-auto max-w-4xl px-6 py-32 text-center">
        <h2 className="font-serif text-4xl leading-[1.12] sm:text-6xl sm:font-light">Totul începe cu <em className="text-liliac-600">o invitație.</em></h2>
        <Link href="/register" className="mt-12 inline-block rounded-[4px] bg-primary px-8 py-4 text-base text-primary-foreground transition-colors duration-150 hover:bg-primary-hover">
          Creează invitația
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border pb-20 md:pb-0">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-12 md:flex-row">
          <div className="font-serif text-2xl">Invitta · RSVP</div>
          <nav aria-label="Subsol" className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
            <Link href="/#features" className="inline-flex min-h-11 items-center transition-colors duration-150 hover:text-liliac-600 md:min-h-8">Funcționalități</Link>
            <Link href="/modele" className="inline-flex min-h-11 items-center transition-colors duration-150 hover:text-liliac-600 md:min-h-8">Modele</Link>
            <Link href="/#pricing" className="inline-flex min-h-11 items-center transition-colors duration-150 hover:text-liliac-600 md:min-h-8">Prețuri</Link>
          </nav>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Invitta RSVP</p>
        </div>
      </footer>
      <MobileCreateCta />
    </div>
  );
}
