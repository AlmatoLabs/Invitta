"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { MODEL_IMAGES as IMAGES } from "@/lib/assets";
import { useChooseInvitation, useSession } from "@/lib/session";
import { DEMOS } from "@/lib/demos";

// Designs shown in colour on the cards; the rest stay greyscale.
const COLOURED = new Set(["minimal-ivory", "italian-romance"]);

export function ModelsView() {
  const session = useSession();
  const router = useRouter();
  const choose = useChooseInvitation();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="collection-section mx-auto max-w-[1400px] px-6 pb-16 pt-20 md:pb-20 md:pt-28">
        <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2 sm:items-end">
          <div>
            <p className="text-xs uppercase text-collection-copy">Colecția 2026</p>
            <h1 className="mt-5 font-serif text-4xl leading-tight lg:text-6xl">
              <span className="block">Modele</span>
              <em className="block">pentru fiecare poveste</em>
            </h1>
          </div>
          <p className="max-w-md text-base leading-relaxed text-collection-copy">
            Deschide demo-ul oricărui model, fără cont. Doar editarea invitației și confirmările au nevoie de autentificare.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-x-12 gap-y-16 sm:grid-cols-2">
          {DEMOS.map((d, index) => (
            <figure key={d.slug} className={`group min-w-0 ${index % 2 === 1 ? "sm:mt-16" : ""}`}>
              <Link
                href={`/invitatie/${d.slug}`}
                aria-label={`Vezi demo-ul ${d.model}`}
                className="block overflow-hidden rounded-[4px] bg-collection-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-collection-ink"
              >
                <img
                  src={IMAGES[d.slug]}
                  alt={`Invitația ${d.model}`}
                  loading="lazy"
                  width={800}
                  height={1200}
                  className={`aspect-[5/4] w-full object-cover ${COLOURED.has(d.slug) ? "" : "grayscale "}transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03] group-focus-within:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none`}
                />
              </Link>
              <figcaption className="mt-7 border-b border-collection-divider pb-10">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-3">
                    <Link
                      href={`/invitatie/${d.slug}`}
                      className="font-serif text-[28px] leading-tight text-collection-ink decoration-1 underline-offset-8 group-hover:underline focus-visible:underline"
                    >
                      {d.model}
                    </Link>
                    <span className="flex shrink-0 gap-1.5" role="img" aria-label="Paletă: alb, gri și negru">
                      {["bg-collection-light", "bg-collection-mid", "bg-collection-ink"].map((c) => (
                        <span key={c} className={`h-3.5 w-3.5 rounded-full border border-collection-divider ${c}`} />
                      ))}
                    </span>
                  </div>
                  <span aria-hidden="true" className="shrink-0 font-serif text-3xl italic text-collection-copy">
                    {["I", "II", "III", "IV"][index]}
                  </span>
                </div>
                <p className="mt-4 text-xs uppercase text-collection-copy">{d.mood}</p>
                <p className="mt-3 text-sm text-collection-copy">{d.dateTitle} · {d.venue}</p>
                <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Link
                    href={`/invitatie/${d.slug}`}
                    className="group/demo inline-flex items-center gap-3 text-[11px] uppercase text-collection-ink"
                  >
                    <span className="border-b border-collection-divider pb-1.5 transition-colors group-hover/demo:border-collection-ink">
                      Vezi demo
                    </span>
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover/demo:translate-x-1">→</span>
                  </Link>
                  {session ? (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={choose.isPending}
                      onClick={() =>
                        choose.mutate(d.slug, { onSuccess: () => router.push("/dashboard/invitatie") })
                      }
                      className="h-auto rounded-[4px] border-collection-ink bg-transparent px-6 py-2.5 text-[11px] font-normal uppercase text-collection-ink shadow-none hover:bg-collection-ink hover:text-collection-light"
                    >
                      Alege acest model
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="outline"
                      className="h-auto rounded-[4px] border-collection-ink bg-transparent px-6 py-2.5 text-[11px] font-normal uppercase text-collection-ink shadow-none hover:bg-collection-ink hover:text-collection-light"
                    >
                      <Link href="/register">Alege acest model</Link>
                    </Button>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-collection-divider pt-10">
          <p className="text-sm text-collection-copy">Nu știi ce ți se potrivește? Vezi pachetele și prețurile.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild className="h-auto rounded-[4px] px-6 py-3 text-[11px] font-normal uppercase shadow-none">
              <Link href="/#pricing">Prețuri</Link>
            </Button>
            <Link href="/" className="text-[11px] uppercase text-collection-ink underline decoration-collection-divider underline-offset-8 hover:decoration-collection-ink">
              Înapoi acasă
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
