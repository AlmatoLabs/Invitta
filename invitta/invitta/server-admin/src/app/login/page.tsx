"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthActions } from "@/lib/session";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const { login } = useAuthActions();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    login.mutate(
      { email, password: pwd },
      { onSuccess: () => router.push("/dashboard/invitatii") },
    );
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-blush text-foreground p-12">
        <Link href="/" className="font-serif text-2xl">Invitta<span className="text-editorial"> · RSVP</span></Link>
        <div>
          <h2 className="font-serif text-4xl leading-tight">&quot;Cea mai <em className="text-display-accent">elegantă</em> modalitate de a-ți invita oaspeții.&quot;</h2>
          <p className="mt-4 text-sm text-muted-foreground">— Mireasa.ro</p>
        </div>
        <p className="eyebrow">Pentru cuplurile care iubesc detaliile</p>
      </div>

      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm">
          <Link href="/" className="md:hidden block text-center font-serif text-2xl mb-12">Invitta<span className="text-editorial"> · RSVP</span></Link>
          <p className="eyebrow">Bun venit înapoi</p>
          <h1 className="mt-3 font-serif text-4xl">Autentificare</h1>

          <form onSubmit={submit} className="mt-10 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">Parolă</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="h-11"
              />
            </div>
            {login.error && (
              <Alert variant="destructive">
                <AlertDescription>{login.error.message}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" size="lg" disabled={login.isPending} className="w-full h-12">
              {login.isPending ? "Se autentifică…" : "Intră în cont"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Nu ai cont încă? <Link href="/register" className="text-link underline underline-offset-4 transition-colors duration-150 hover:text-link-hover">Creează unul</Link>
          </p>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Sau <Link href="/modele" className="text-link underline underline-offset-4 transition-colors duration-150 hover:text-link-hover">vezi modelele fără cont</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
