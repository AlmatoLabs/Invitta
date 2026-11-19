"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ProfileMenu } from "@/components/SiteHeader";
import { useSessionState } from "@/lib/session";

const nav = [
  { to: "/dashboard/invitatii", label: "Invitațiile mele" },
  { to: "/dashboard", label: "Acasă" },
  { to: "/dashboard/invitatie", label: "Invitația" },
  { to: "/dashboard/rsvp", label: "RSVP" },
  { to: "/dashboard/mese", label: "Mese" },
];

// Only usable once the couple has chosen an invitation.
const INVITE_ONLY: string[] = ["/dashboard/invitatie", "/dashboard/rsvp", "/dashboard/mese"];

function NoInviteYet() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="eyebrow">Nicio invitație încă</p>
      <h1 className="mt-3 font-serif text-4xl">Începe prin a alege un model</h1>
      <p className="mx-auto mt-4 max-w-md text-base text-foreground">
        Editarea invitației, confirmările și mesele apar după ce alegi un model din colecție.
      </p>
      <Link href="/modele" className="mt-8 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground transition-colors duration-150 hover:bg-primary-hover">
        Alege un model
      </Link>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, loading } = useSessionState();
  useEffect(() => {
    if (!loading && !session) router.replace("/login");
  }, [loading, session, router]);
  const hasInvite = session?.hasInvite === true;
  const visible = hasInvite ? nav : nav.filter((n) => !INVITE_ONLY.includes(n.to));
  const blocked = Boolean(session) && !hasInvite && INVITE_ONLY.includes(pathname);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl">Invitta<span className="text-editorial"> · RSVP</span></Link>
          <nav className="hidden md:flex items-center gap-2 text-sm">
            {visible.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  href={n.to}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full border px-4 py-1.5 transition-colors duration-150 ${active ? "border-primary bg-blush-2 font-medium text-foreground" : "border-transparent text-muted-foreground hover:bg-blush hover:text-link"}`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <ProfileMenu />
          </div>
        </div>
        <nav className="md:hidden flex items-center gap-1 overflow-x-auto px-6 pb-3 text-xs">
          {visible.map((n) => {
            const active = pathname === n.to;
            return (
              <Link key={n.to} href={n.to} aria-current={active ? "page" : undefined} className={`shrink-0 rounded-full border px-4 py-2 transition-colors duration-150 ${active ? "border-primary bg-blush-2 font-medium text-foreground" : "border-transparent text-muted-foreground hover:bg-blush hover:text-link"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main>{!session ? null : blocked ? <NoInviteYet /> : children}</main>
    </div>
  );
}
