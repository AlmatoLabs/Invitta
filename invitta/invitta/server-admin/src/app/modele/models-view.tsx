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

      <section className="mx-auto max-w-[1400px] px-6 pb-16 pt-20 md:pb-20 md:pt-28">
        <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2 sm:items-end">
          <div>
            <p className="eyebrow">Colecția 2026</p>
            <h1 className="mt-5 font-serif text-4xl leading-[1.12] text-foreground lg:text-6xl lg:font-light">
              <span className="block">Modele</span>
              <em className="block">pentru fiecare poveste</em>
            </h1>
          </div>
          <p className="max-w-md text-base text-foreground">
            Deschide demo-ul oricărui model, fără cont. Doar editarea invitației și confirmările au nevoie de autentificare.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-x-12 gap-y-16 sm:grid-cols-2">
          {DEMOS.map((d, index) => (
            <figure key={d.slug} className={`group min-w-0 ${index % 2 === 1 ? "sm:mt-16" : ""}`}>
              <Link
                href={`/invitatie/${d.slug}`}
                aria-label={`Vezi demo-ul ${d.model}`}
                className="block overflow-hidden rounded-[4px] bg-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
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
              <figcaption className="mt-7 border-b border-border pb-10">
                <div className="flex items-baseline justify-between gap-4">
                  <Link
                    href={`/invitatie/${d.slug}`}
                    className="min-w-0 font-serif text-[28px] leading-tight text-foreground decoration-1 underline-offset-8 transition-colors duration-150 hover:text-link group-hover:underline focus-visible:underline"
                  >
                    {d.model}
                  </Link>
                  <span aria-hidden="true" className="shrink-0 font-serif text-3xl italic text-display-accent">
                    {["I", "II", "III", "IV"][index]}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{d.mood}</p>
                <p className="mt-1 text-sm text-muted-foreground">{d.dateTitle} · {d.venue}</p>
                <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Link
                    href={`/invitatie/${d.slug}`}
                    className="group/demo inline-flex min-h-8 items-center gap-3 text-[14px] font-medium text-link transition-colors duration-150 hover:text-link-hover"
                  >
                    <span className="border-b border-link/40 pb-1 transition-colors duration-150 group-hover/demo:border-link-hover">
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
                      className="h-auto min-h-11 px-6 py-2.5 text-[14px] font-medium"
                    >
                      Alege acest model
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="outline"
                      className="h-auto min-h-11 px-6 py-2.5 text-[14px] font-medium"
                    >
                      <Link href={`/register?design=${d.slug}`}>Alege acest model</Link>
                    </Button>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-10">
          <p className="text-base text-foreground">Nu știi ce ți se potrivește? Vezi pachetele și prețurile.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild className="h-auto px-6 py-3 text-[14px] font-medium">
              <Link href="/#pricing">Prețuri</Link>
            </Button>
            <Link href="/" className="inline-flex min-h-8 items-center text-[14px] font-medium text-link underline decoration-link/40 underline-offset-8 transition-colors duration-150 hover:text-link-hover hover:decoration-link-hover">
              Înapoi acasă
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
