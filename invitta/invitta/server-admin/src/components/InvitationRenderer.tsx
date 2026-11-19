"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { withDefaults, type InvitationContent } from "@/lib/invitation-content";

type Section = { key: string; label: string; enabled: boolean };
type Data = Record<string, any> & { sections?: Section[] };

const FONT_MAP: Record<string, string> = {
  cormorant: '"Cormorant Garamond", serif',
  playfair: '"Playfair Display", serif',
  italianno: '"Italianno", cursive',
  dmserif: '"DM Serif Display", serif',
};

const SCRIPT_FONT = '"Italianno", "Great Vibes", cursive';
const WOOD = "#2f3b32"; // dark green wood tone


/**
 * Renders an invitation from its saved content.
 * - preview: the couple's own view from the editor (RSVP form is inert, "✕" goes back to the editor)
 * - public:  what guests see at /invitatie/[slug] (RSVP form submits to the API)
 */
export function InvitationRenderer({
  content,
  slug,
}: {
  content: Record<string, any>;
  /** Pass the invitation slug to enable the live RSVP form (public page). */
  slug?: string;
}) {
  const data: Data = withDefaults(content as Partial<InvitationContent>);
  const sections: Section[] = data.sections ?? [];
  const enabled = sections.filter((s) => s.enabled);
  const has = (k: string) => enabled.some((s) => s.key === k);

  return (
    <div className="tpl-scope min-h-screen" style={{ background: WOOD, color: "#f7f3ea" }}>
      <TopNav data={data} has={has} showClose={!slug} />

      <div className="scroll-smooth">
        {enabled.map((s) => (
          <SectionBlock key={s.key} section={s} data={data} slug={slug} />
        ))}
      </div>
    </div>
  );
}

function TopNav({ data, has, showClose }: { data: Data; has: (k: string) => boolean; showClose: boolean }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 py-5 flex items-center justify-between">
      <div className="text-tpl-ivory">
        <div className="font-serif text-lg sm:text-xl">{data.navTitle || "Nunta noastră"}</div>
        <div className="italic text-xs opacity-80 mt-0.5" style={{ fontFamily: SCRIPT_FONT, fontSize: 14 }}>
          {data.dateLabel || ""}
        </div>
      </div>
      <nav className="hidden sm:flex items-center gap-10 text-sm tracking-wide text-tpl-ivory">
        {has("story") && <a href="#ce" className="hover:opacity-70 transition">Ce?</a>}
        {(has("countdown") || has("hero")) && <a href="#cand" className="hover:opacity-70 transition">Când?</a>}
        {(has("civil") || has("religious") || has("party")) && (
          <a href="#unde" className="hover:opacity-70 transition">Unde?</a>
        )}
        {has("rsvp") && <a href="#confirmare" className="hover:opacity-70 transition">Confirmare</a>}
      </nav>
      {showClose ? (
      <Link
        href="/dashboard/invitatie"
        title="Înapoi la editor"
        className="h-8 w-8 rounded-full flex items-center justify-center text-tpl-ivory/80 hover:text-tpl-ivory transition text-lg"
      >
        ✕
      </Link>
      ) : <span className="h-8 w-8" />}
    </div>
  );
}

function SectionBlock({ section, data, slug }: { section: Section; data: Data; slug?: string }) {
  switch (section.key) {
    case "hero":
      return <HeroSection data={data} />;
    case "countdown":
      return <CountdownSection data={data} />;
    case "couple":
      return <CoupleSection data={data} />;
    case "parents":
      return <ParentsSection data={data} />;
    case "civil":
    case "religious":
    case "party":
      // grouped into one EventDetails section, render once on the first key seen
      return <EventDetailsAnchor data={data} sectionKey={section.key} />;
    case "story":
      return <StorySection data={data} />;
    case "thanks":
      return <ThanksSection data={data} />;
    case "rsvp":
      return <RsvpSection data={data} slug={slug} />;
    default:
      return null;
  }
}

/* Render the combined "Detaliile evenimentului" once, only for the first
   enabled place key, so we don't get three duplicate sections. */
function EventDetailsAnchor({ data, sectionKey }: { data: Data; sectionKey: string }) {
  const sections: Section[] = data.sections ?? [];
  const places = sections.filter((s) => s.enabled && ["civil", "religious", "party"].includes(s.key));
  if (places.length === 0 || places[0].key !== sectionKey) return null;
  return <EventDetailsSection data={data} places={places.map((p) => p.key)} />;
}

/* ============================ Hero ============================ */

function HeroSection({ data }: { data: Data }) {
  const font = FONT_MAP[data.headerFont] ?? FONT_MAP.cormorant;
  const names =
    data.headerReplacement ||
    [data.brideFirst, data.groomFirst].filter(Boolean).join(" și ") ||
    "Olivia și Albert";

  return (
    <section id="ce" className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center px-6" style={{ background: WOOD }}>
      <div className="relative z-10 text-tpl-ivory animate-fade-in pt-24 pb-16">
        <p className="text-[11px] uppercase tracking-[0.4em] opacity-80">{data.heroIntro}</p>

        <h1
          className="mt-10 text-6xl sm:text-7xl md:text-8xl text-white"
          style={{ fontFamily: SCRIPT_FONT, lineHeight: 1 }}
        >
          {data.heroTitle || "Ne căsătorim!"}
        </h1>

        <p className="mt-8 text-2xl sm:text-3xl" style={{ fontFamily: font }}>
          {names}
        </p>

        {data.godparentsNames && (
          <div className="mt-14">
            <p className="italic text-lg opacity-90" style={{ fontFamily: SCRIPT_FONT, fontSize: 26 }}>
              {data.godparentsLabel || "Împreună cu nașii"}
            </p>
            <p className="mt-3 font-serif text-lg whitespace-pre-line">{data.godparentsNames}</p>
          </div>
        )}

        {data.parentsNames && (
          <div className="mt-10">
            <p className="italic opacity-90" style={{ fontFamily: SCRIPT_FONT, fontSize: 26 }}>
              {data.parentsLabel || "Dragii noștri părinți"}
            </p>
            <p className="mt-3 font-serif text-lg whitespace-pre-line">{data.parentsNames}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================ Countdown ============================ */

function CountdownSection({ data }: { data: Data }) {
  const target = useMemo(() => {
    const d = data.date ? new Date(`${data.date}T${data.time || "00:00"}`) : null;
    return d && !isNaN(d.getTime()) ? d : null;
  }, [data.date, data.time]);

  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const diff = target && now ? Math.max(0, target.getTime() - now.getTime()) : 0;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const mins = Math.floor((diff / 60000) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  const city = [data.partyCity, data.religiousCity, data.civilCity].find(Boolean) || "";

  return (
    <section id="cand" className="px-6 py-24" style={{ background: WOOD }}>
      <div className="mx-auto max-w-3xl">
        <div className="text-center text-tpl-ivory">
          <p className="italic opacity-90" style={{ fontFamily: SCRIPT_FONT, fontSize: 40 }}>
            our wedding
          </p>
          <h2 className="mt-2 text-5xl sm:text-6xl" style={{ fontFamily: SCRIPT_FONT }}>
            {data.dateLabel || "5 Septembrie 2026"}
          </h2>
          {city && <p className="mt-4 italic text-lg" style={{ fontFamily: SCRIPT_FONT, fontSize: 22 }}>{city}</p>}

          <div className="mt-10 flex gap-8 justify-center">
            {[
              { v: days, l: "Zile" },
              { v: hours, l: "Ore" },
              { v: mins, l: "Minute" },
              { v: secs, l: "Secunde" },
            ].map((b) => (
              <div key={b.l} className="text-center">
                <div className="font-serif text-4xl sm:text-5xl text-tpl-ivory">{b.v}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] opacity-70">{b.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ Couple / Parents (compact) ============================ */

function CoupleSection({ data }: { data: Data }) {
  if (!data.brideFirst && !data.groomFirst) return null;
  return (
    <section className="px-6 py-20" style={{ background: WOOD }}>
      <div className="mx-auto max-w-3xl grid sm:grid-cols-2 gap-10 text-center text-tpl-ivory">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-70">Mireasă</p>
          <h3 className="mt-3 text-5xl" style={{ fontFamily: SCRIPT_FONT }}>{data.brideFirst}</h3>
          {data.brideLast && <p className="mt-1 font-serif opacity-80">{data.brideLast}</p>}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-70">Mire</p>
          <h3 className="mt-3 text-5xl" style={{ fontFamily: SCRIPT_FONT }}>{data.groomFirst}</h3>
          {data.groomLast && <p className="mt-1 font-serif opacity-80">{data.groomLast}</p>}
        </div>
      </div>
    </section>
  );
}

function ParentsSection({ data }: { data: Data }) {
  if (!data.parentsNames && !data.godparentsNames) return null;
  return (
    <section className="px-6 py-20" style={{ background: WOOD }}>
      <div className="mx-auto max-w-2xl text-center space-y-12 text-tpl-ivory">
        {data.parentsNames && (
          <div>
            <p className="italic opacity-90" style={{ fontFamily: SCRIPT_FONT, fontSize: 26 }}>
              {data.parentsLabel || "Părinții noștri"}
            </p>
            <p className="mt-4 font-serif text-xl whitespace-pre-line">{data.parentsNames}</p>
          </div>
        )}
        {data.godparentsNames && (
          <div>
            <p className="italic opacity-90" style={{ fontFamily: SCRIPT_FONT, fontSize: 26 }}>
              {data.godparentsLabel || "Nașii"}
            </p>
            <p className="mt-4 font-serif text-xl whitespace-pre-line">{data.godparentsNames}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================ Event details ("Unde?") ============================ */

function EventDetailsSection({ data, places }: { data: Data; places: string[] }) {
  const civil = {
    title: "Cununia civilă",
    venue: data.civilVenue,
    address: data.civilAddress,
    city: data.civilCity,
    date: data.civilDate,
  };
  const religious = {
    title: "Cununia religioasă",
    venue: data.religiousVenue,
    address: data.religiousAddress,
    city: data.religiousCity,
    date: data.religiousDate,
  };
  const party = {
    title: "Petrecerea",
    venue: data.partyVenue,
    address: data.partyAddress,
    city: data.partyCity,
    date: data.partyDate,
  };
  const map: Record<string, typeof civil> = { civil, religious, party };
  const items = places.map((k) => map[k]).filter((p) => p.venue || p.address || p.date);

  return (
    <section id="unde" className="relative px-6 py-28" style={{ background: "#efe9df", color: "#2b2b2b" }}>
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-5xl sm:text-6xl" style={{ fontFamily: SCRIPT_FONT }}>
          Detaliile evenimentului
        </h2>
        <p className="mt-3 italic text-xl opacity-80" style={{ fontFamily: SCRIPT_FONT, fontSize: 24 }}>
          Când și unde
        </p>

        <div className="mx-auto mt-10 max-w-2xl space-y-4 font-serif text-base leading-relaxed text-tpl-noir/80">
          {civil.venue && (
            <p>
              Cununia civilă va avea loc la <strong>{civil.venue}</strong>
              {civil.city ? ` din ${civil.city}` : ""}.
            </p>
          )}
          {(religious.venue || party.venue) && (
            <p>
              {religious.venue && (
                <>Cununia religioasă va avea loc la <strong>{religious.venue}</strong>{religious.city ? ` din ${religious.city}` : ""}, </>
              )}
              {party.venue && (
                <>pe urmă vom sărbători evenimentul la <strong>{party.venue}</strong>{party.city ? `, ${party.city}` : ""}.</>
              )}
            </p>
          )}
          <p className="opacity-70">Detalii mai jos.</p>
        </div>

        <div className="mt-16 grid sm:grid-cols-3 gap-10">
          {items.map((p) => (
            <div key={p.title} className="text-center">
              <h3 className="text-3xl" style={{ fontFamily: SCRIPT_FONT }}>{p.title}</h3>
              <div className="mt-6 font-serif text-sm leading-7">
                {p.date && <div>{p.date}</div>}
                {p.venue && <div>{p.venue}</div>}
                {p.address && <div>{p.address}</div>}
                {p.city && <div>{p.city}</div>}
              </div>
              <div
                className="mt-6 inline-block rounded-[4px] px-6 py-2.5 text-xs uppercase tracking-[0.25em] select-none"
                style={{ background: "#2b2b2b", color: "#fafaf6" }}
              >
                Vezi hartă
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ Story / Gallery / Thanks ============================ */

function StorySection({ data }: { data: Data }) {
  if (!data.storyTitle && !data.storyText && !data.youtubeId) return null;
  return (
    <section className="px-6 py-24" style={{ background: "#efe9df", color: "#2b2b2b" }}>
      <div className="mx-auto max-w-3xl text-center">
        <h3 className="text-5xl" style={{ fontFamily: SCRIPT_FONT }}>{data.storyTitle || "Povestea noastră"}</h3>
        <div className="h-px bg-tpl-border mx-auto my-8 w-16" />
        <p className="font-serif text-lg leading-relaxed whitespace-pre-line opacity-80">{data.storyText}</p>
        {data.youtubeId && (
          <div className="mt-12 aspect-video w-full overflow-hidden rounded-md pointer-events-none">
            <iframe
              src={`https://www.youtube.com/embed/${data.youtubeId}`}
              title="video"
              className="h-full w-full"
              allowFullScreen={false}
              tabIndex={-1}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function ThanksSection({ data }: { data: Data }) {
  if (!data.thanksTitle && !data.thanksText) return null;
  return (
    <section className="px-6 py-24" style={{ background: WOOD, color: "#f7f3ea" }}>
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="text-6xl" style={{ fontFamily: SCRIPT_FONT }}>{data.thanksTitle || "Cu drag"}</h3>
        <div className="h-px bg-tpl-border mx-auto my-8 w-16" />
        <p className="font-serif text-xl leading-relaxed opacity-90">{data.thanksText}</p>
      </div>
    </section>
  );
}

/* ============================ RSVP ============================ */

function RsvpSection({ data, slug }: { data: Data; slug?: string }) {
  const live = Boolean(slug);
  const [form, setForm] = useState({ name: "", people: "1", menu: "standard", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "done-yes" | "done-no">("idle");
  const [error, setError] = useState("");

  const field =
    "w-full rounded-[4px] px-5 py-3.5 text-sm bg-transparent border border-white/30 text-tpl-ivory placeholder:text-tpl-ivory/60 outline-none focus:border-white/70";
  const label = "text-center text-sm font-medium mb-2";

  const send = async (attend: boolean) => {
    if (!form.name.trim()) {
      setError("Te rugăm să scrii numele tău.");
      return;
    }
    setError("");
    setState("sending");
    try {
      await api(`/public/invitations/${slug}/rsvp`, {
        body: {
          name: form.name.trim(),
          attend,
          people: Number(form.people) || 1,
          menu: attend && data.askMenu !== false ? form.menu : null,
          message: form.message.trim() || null,
        },
      });
      setState(attend ? "done-yes" : "done-no");
    } catch (e) {
      setError(e instanceof Error ? e.message : "A apărut o eroare.");
      setState("idle");
    }
  };

  return (
    <section id="confirmare" className="px-6 py-24" style={{ background: WOOD, color: "#f7f3ea" }}>
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-6xl" style={{ fontFamily: SCRIPT_FONT }}>Confirmare</h2>

        {state === "done-yes" || state === "done-no" ? (
          <div className="mt-12 rounded-md border border-white/30 py-12">
            <p className="font-serif text-3xl">Mulțumim!</p>
            <p className="mt-2 text-sm opacity-80">
              {state === "done-yes" ? "Confirmarea ta a fost trimisă cu drag." : "Ne pare rău că nu poți ajunge. Am notat răspunsul tău."}
            </p>
          </div>
        ) : (
          <>
            <form
              className={`mt-12 space-y-6 text-left ${live ? "" : "pointer-events-none opacity-95"}`}
              inert={!live}
              onSubmit={(e: FormEvent) => e.preventDefault()}
            >
              <div>
                <div className={label}>Numele tău</div>
                {live ? (
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} placeholder="Nume și prenume" />
                ) : (
                  <div className={field}>Nume și prenume</div>
                )}
              </div>
              {data.askPeople !== false && (
                <div>
                  <div className={label}>Numărul de persoane</div>
                  {live ? (
                    <select value={form.people} onChange={(e) => setForm({ ...form, people: e.target.value })} className={field}>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n} className="bg-tpl-noir">{n}</option>
                      ))}
                    </select>
                  ) : (
                    <div className={field}>Alege număr persoane ⌄</div>
                  )}
                </div>
              )}
              {data.askMenu !== false && (
                <div>
                  <div className={label}>Tip meniu</div>
                  {live ? (
                    <select value={form.menu} onChange={(e) => setForm({ ...form, menu: e.target.value })} className={field}>
                      <option value="standard" className="bg-tpl-noir">Standard</option>
                      <option value="vegetarian" className="bg-tpl-noir">Vegetarian</option>
                      <option value="vegan" className="bg-tpl-noir">Vegan</option>
                    </select>
                  ) : (
                    <div className={field}>Alege tip meniu ⌄</div>
                  )}
                </div>
              )}
              <div>
                <div className={label}>Vrei să ne transmiți ceva?</div>
                {live ? (
                  <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${field} min-h-[110px] resize-none`} />
                ) : (
                  <div className="w-full rounded-md px-5 py-4 text-sm bg-transparent border border-white/30 min-h-[110px]" />
                )}
              </div>
            </form>

            {error && <p role="alert" className="mt-6 text-sm text-red-200">{error}</p>}

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                disabled={!live || state === "sending"}
                onClick={() => send(true)}
                className="rounded-[4px] px-6 py-3 text-sm disabled:cursor-default disabled:opacity-90"
                style={{ background: "#3f6b46", color: "#fafaf6" }}
              >
                Da, confirm prezența
              </button>
              <button
                type="button"
                disabled={!live || state === "sending"}
                onClick={() => send(false)}
                className="rounded-[4px] border border-white/40 px-6 py-3 text-sm disabled:cursor-default"
              >
                Nu pot să particip
              </button>
            </div>
          </>
        )}

        {data.rsvpDeadline && (
          <p className="mt-8 text-[11px] uppercase tracking-[0.3em] opacity-70">Până la {data.rsvpDeadline}</p>
        )}
        {!live && (
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] opacity-50">Modul de previzualizare — doar vizualizare</p>
        )}
      </div>
    </section>
  );
}
