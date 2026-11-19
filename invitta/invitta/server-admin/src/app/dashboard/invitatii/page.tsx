"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInvitation } from "@/lib/queries";
import { useStats } from "@/lib/queries";
import { useSession } from "@/lib/session";

export default function MyInvites() {
  const session = useSession();
  const hasInvite = session?.hasInvite === true;
  const { data: invitation } = useInvitation(session?.invitation?.id);
  const { data: stats } = useStats(session?.invitation?.id);
  const c = invitation?.content ?? {};
  const couple = [c.brideFirst, c.groomFirst].filter(Boolean).join(" & ") || session?.name || "";
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="eyebrow">Contul tău</p>
      <h1 className="mt-3 font-serif text-5xl">Invitațiile mele</h1>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {!hasInvite ? (
          <Card className="shadow-none">
            <CardContent className="p-8">
              <p className="text-xs font-medium text-muted-foreground">Nicio invitație încă</p>
              <h2 className="mt-3 font-serif text-3xl">Începe prima ta invitație</h2>
              <p className="mt-2 text-base text-foreground">Alege un model din colecție și personalizează-l.</p>
              <div className="mt-8"><Button asChild><Link href="/modele">Alege un model</Link></Button></div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-none">
            <CardContent className="p-8">
              <p className="text-xs font-medium text-muted-foreground">Activă{typeof c.dateLabel === "string" && c.dateLabel ? ` · ${c.dateLabel}` : ""}</p>
              <h2 className="mt-3 font-serif text-3xl">{couple}</h2>
              <p className="mt-2 text-sm text-muted-foreground">invitta.ro/{session?.invitation?.slug} · {stats?.confirmed ?? 0} confirmări</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild><Link href="/dashboard/invitatie">Editează invitația</Link></Button>
                <Button asChild variant="outline"><Link href={`/invitatie/${session?.invitation?.slug}`}>Vezi invitația</Link></Button>
                <Button asChild variant="outline"><Link href="/dashboard/rsvp">Vezi RSVP-uri</Link></Button>
              </div>
            </CardContent>
          </Card>
        )}
        {hasInvite && (
          <Link href="/modele" className="flex min-h-[220px] flex-col items-center justify-center rounded-md border border-dashed border-border p-8 text-center transition-colors duration-150 hover:border-primary hover:bg-blush">
            <span aria-hidden="true" className="font-serif text-4xl text-link">+</span>
            <span className="mt-2 text-sm">Schimbă modelul</span>
          </Link>
        )}
      </div>
    </div>
  );
}
