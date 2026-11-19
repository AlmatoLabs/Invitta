"use client";

import Link from "next/link";
import { daysUntil, useInvitation, useStats } from "@/lib/queries";
import { useSession } from "@/lib/session";

function ActionLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-md border border-border bg-card p-8 transition-all hover:border-primary hover:soft-shadow"
    >
      <div>
        <h3 className="font-serif text-2xl">{title}</h3>
        <p className="mt-2 text-base text-foreground">{desc}</p>
      </div>
      <span className="text-link text-2xl group-hover:translate-x-1 transition-transform">→</span>
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
    // Statusuri RSVP: fond -bg, text în culoarea status, bară subțire -bar.
    { label: "Confirmați", value: stats?.confirmed ?? 0, cls: "bg-success-bg text-success", bar: "bg-success-bar" },
    { label: "În așteptare", value: stats?.pending ?? 0, cls: "bg-warning-bg text-warning", bar: "bg-warning-bar" },
    { label: "Nu vin", value: stats?.declined ?? 0, cls: "bg-declined-bg text-declined", bar: "bg-declined-bar" },
    { label: "Total invitați", value: stats?.total ?? 0, cls: "bg-card text-foreground", bar: "bg-line" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {hasInvite && dateLabel && (
        <p className="eyebrow">
          {dateLabel}
          {days !== null && days >= 0 ? ` · ${days} zile rămase` : ""}
        </p>
      )}
      <h1 className="mt-3 font-serif text-5xl font-light text-balance">Bine ai venit{firstName ? `, ${firstName}` : ""}</h1>
      <p className="mt-4 max-w-lg text-base text-foreground">
        {hasInvite
          ? "Totul merge perfect pentru ziua voastră. Iată o privire calmă asupra organizării."
          : "Încă nu ai o invitație. Alege un model pentru a începe."}
      </p>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {tiles.map((s) => (
          <div key={s.label} className={`rounded-md border border-border p-5 sm:p-6 ${s.cls}`}>
            <span aria-hidden="true" className={`block h-1 w-10 rounded-full ${s.bar}`} />
            <p className="mt-3 text-sm font-medium">{s.label}</p>
            <p className="mt-3 font-serif text-5xl font-light">{s.value}</p>
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
              className="group flex items-center justify-between rounded-md border border-border bg-card p-8 transition-all hover:border-primary hover:soft-shadow"
            >
              <div>
                <h3 className="font-serif text-2xl">Distribuie invitația</h3>
                <p className="mt-2 text-sm text-muted-foreground">Linkul tău: invitta.ro/{session.invitation.slug}</p>
              </div>
              <span className="text-link text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </>
      ) : (
        <div className="rounded-md border border-dashed border-border bg-card p-8">
          <p className="text-xs font-medium text-muted-foreground">Primul pas</p>
          <h2 className="mt-3 font-serif text-2xl">Alege modelul invitației</h2>
          <p className="mt-2 text-base text-foreground">Deschide colecția, vezi demo-urile și alege modelul care vi se potrivește.</p>
          <Link href="/modele" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground transition-colors duration-150 hover:bg-primary-hover">Alege un model</Link>
        </div>
      )}
    </div>
  );
}
