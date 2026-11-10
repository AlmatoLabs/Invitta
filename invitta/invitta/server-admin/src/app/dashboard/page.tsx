"use client";

import Link from "next/link";
import { daysUntil, useInvitation, useStats } from "@/lib/queries";
import { useSession } from "@/lib/session";

function ActionLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-md border border-border bg-card p-8 transition-all hover:border-champagne hover:soft-shadow"
    >
      <div>
        <h3 className="font-serif text-2xl">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      </div>
      <span className="text-champagne text-2xl group-hover:translate-x-1 transition-transform">→</span>
    </Link>
  );
}

export default function DashboardHome() {
  const session = useSession();
  const hasInvite = session?.hasInvite === true;
  const invitationId = session?.invitation?.id;
  const { data: invitation } = useInvitation(invitationId);
  const { data: stats } = useStats(invitationId);

  const firstName = session?.name.split(/[\s&]+/)[0] ?? "";
  const days = daysUntil(invitation?.content.date);
  const dateLabel = typeof invitation?.content.dateLabel === "string" ? invitation.content.dateLabel : "";
  const tiles = [
    { label: "Confirmați", value: stats?.confirmed ?? 0, accent: true },
    { label: "Refuzați", value: stats?.declined ?? 0 },
    { label: "Total invitați", value: stats?.total ?? 0 },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {hasInvite && dateLabel && (
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
          {dateLabel}
          {days !== null && days >= 0 ? ` · ${days} zile rămase` : ""}
        </p>
      )}
      <h1 className="mt-3 font-serif text-5xl text-balance">Bine ai venit{firstName ? `, ${firstName}` : ""}</h1>
      <p className="mt-4 text-muted-foreground max-w-lg">
        {hasInvite
          ? "Totul merge perfect pentru ziua voastră. Iată o privire calmă asupra organizării."
          : "Încă nu ai o invitație. Alege un model pentru a începe."}
      </p>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
        {tiles.map((s) => (
          <div key={s.label} className={`rounded-md border border-border p-6 ${s.accent ? "bg-noir text-ivory" : "bg-card"}`}>
            <p className={`text-xs uppercase tracking-[0.2em] ${s.accent ? "text-ivory/60" : "text-muted-foreground"}`}>{s.label}</p>
            <p className="mt-4 font-serif text-5xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="my-16 gold-divider" />

      {hasInvite && session?.invitation ? (
        <>
          <h2 className="font-serif text-2xl">Ce vrei să faci astăzi?</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <ActionLink href="/dashboard/invitatie" title="Editează invitația" desc="Personalizează design-ul și conținutul" />
            <ActionLink href="/dashboard/rsvp" title="Vezi RSVP-uri" desc="Confirmările și mesajele invitaților" />
            <ActionLink href="/dashboard/mese" title="Aranjează mesele" desc="Drag & drop pentru așezarea perfectă" />
            <Link
              href={`/invitatie/${session.invitation.slug}`}
              className="group flex items-center justify-between rounded-md border border-border bg-card p-8 transition-all hover:border-champagne hover:soft-shadow"
            >
              <div>
                <h3 className="font-serif text-2xl">Distribuie invitația</h3>
                <p className="mt-2 text-sm text-muted-foreground">Linkul tău: invitta.ro/{session.invitation.slug}</p>
              </div>
              <span className="text-champagne text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </>
      ) : (
        <div className="rounded-md border border-dashed border-border bg-card p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Primul pas</p>
          <h2 className="mt-3 font-serif text-2xl">Alege modelul invitației</h2>
          <p className="mt-2 text-sm text-muted-foreground">Deschide colecția, vezi demo-urile și alege modelul care vi se potrivește.</p>
          <Link href="/modele" className="mt-6 inline-flex rounded-[4px] bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:opacity-90">Alege un model</Link>
        </div>
      )}
    </div>
  );
}
