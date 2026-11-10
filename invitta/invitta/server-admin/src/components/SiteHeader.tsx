"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { getStoredLang, setLanguage, LANG_EVENT, type Lang } from "@/lib/i18n";
import { useAuthActions, useSession } from "@/lib/session";
import { User } from "lucide-react";

const t = { features: "Funcționalități", models: "Modele", pricing: "Prețuri", create: "Creează invitația", profile: "Profilul meu", dashboard: "Panoul meu", language: "Limbă", signIn: "Autentificare", account: "Contul tău" };

export function ProfileMenu() {
  const [lang, setLangState] = useState<Lang>("ro");
  const session = useSession();
  const { logout } = useAuthActions();
  useEffect(() => {
    setLangState(getStoredLang());
    const on = (e: Event) => setLangState((e as CustomEvent<Lang>).detail);
    window.addEventListener(LANG_EVENT, on);
    return () => window.removeEventListener(LANG_EVENT, on);
  }, []);
  const setLang = (l: Lang) => setLanguage(l);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const initial = session?.name?.trim()?.charAt(0)?.toUpperCase();
  return (
    <div ref={ref} className="relative">
      <Button variant="outline" size="icon" onClick={() => setOpen(!open)} aria-label={t.account} aria-expanded={open}
        className="h-10 w-10 rounded-full font-serif text-sm shadow-none hover:bg-muted">
        {initial ? initial : <User size={18} strokeWidth={1.5} aria-hidden />}
      </Button>
      {open && (
        <div className="absolute right-0 mt-3 w-60 rounded-[6px] border border-border bg-background p-4 shadow-lg">
          {session ? (
            <>
              <p className="font-serif text-lg">{session.name || "Invitta"}</p>
              <p className="text-xs text-muted-foreground">{session.email}</p>
              <div className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
                <Link href="/dashboard/invitatii" onClick={() => setOpen(false)} className="block hover:text-muted-foreground">Invitațiile mele</Link>
                <Link href="/dashboard/profil" onClick={() => setOpen(false)} className="block hover:text-muted-foreground">{t.profile}</Link>
                <Link href="/dashboard/facturi" onClick={() => setOpen(false)} className="block hover:text-muted-foreground">Facturile mele</Link>
              </div>
            </>
          ) : (
            <div className="space-y-2 text-sm">
              <p className="font-serif text-lg">Bine ai venit</p>
              <p className="text-xs text-muted-foreground">Vezi modelele și demo-urile fără cont.</p>
              <div className="mt-4 space-y-2 border-t border-border pt-3">
                <Link href="/modele" onClick={() => setOpen(false)} className="block hover:text-muted-foreground">Modele</Link>
                <Button asChild className="mt-2 w-full shadow-none"><Link href="/login" onClick={() => setOpen(false)}><User size={16} strokeWidth={1.5} aria-hidden />{t.signIn}</Link></Button>
              </div>
            </div>
          )}
          <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{t.language}</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["ro", "en"] as Lang[]).map((l) => (
              <Button key={l} variant={lang === l ? "default" : "outline"} onClick={() => setLang(l)}
                className={`shadow-none ${lang === l ? "border border-foreground" : "hover:bg-muted"}`}>
                <span data-no-translate>{l === "ro" ? "Română" : "English"}</span>
              </Button>
            ))}
          </div>
          {session && (
            <Button variant="ghost" onClick={() => { setOpen(false); logout(); }} className="mt-4 h-auto w-full justify-start rounded-none border-t border-border px-0 pt-3 text-left font-normal hover:bg-transparent hover:text-muted-foreground">
              Deconectare
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const session = useSession();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-ivory/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-serif text-2xl tracking-tight">
          Invitta<span className="text-champagne"> · </span><span className="text-base tracking-[0.3em] uppercase">RSVP</span>
        </Link>
        <nav className="hidden items-center gap-10 text-sm text-muted-foreground md:flex">
          <Link href="/#features" className="hover:text-foreground transition-colors">{t.features}</Link>
          <Link href="/modele" className="hover:text-foreground transition-colors">{t.models}</Link>
          <Link href="/#pricing" className="hover:text-foreground transition-colors">{t.pricing}</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild className="hidden sm:inline-flex px-5 shadow-none">
            <Link href="/register">{t.create}</Link>
          </Button>
          <ProfileMenu />
          <Button variant="outline" size="icon" className="md:hidden h-auto w-auto rounded-full p-2 shadow-none" onClick={() => setOpen(!open)} aria-label="Menu">
            <div className="space-y-1.5">
              <span className="block h-px w-5 bg-foreground" />
              <span className="block h-px w-5 bg-foreground" />
            </div>
          </Button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-ivory px-6 py-6 space-y-4 text-sm">
          <Link href="/#features" onClick={() => setOpen(false)} className="block">{t.features}</Link>
          <Link href="/modele" onClick={() => setOpen(false)} className="block">{t.models}</Link>
          <Link href="/#pricing" onClick={() => setOpen(false)} className="block">{t.pricing}</Link>
          {!session && (
            <Link href="/login" onClick={() => setOpen(false)} className="block text-muted-foreground">{t.signIn}</Link>
          )}
          <Button asChild className="h-11 w-full shadow-none"><Link href="/register" onClick={() => setOpen(false)}>{t.create}</Link></Button>
        </div>
      )}
    </header>
  );
}
