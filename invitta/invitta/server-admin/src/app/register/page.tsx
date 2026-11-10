"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthActions } from "@/lib/session";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", pwd: "" });
  const { register } = useAuthActions();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    register.mutate(
      { name: form.name, email: form.email, password: form.pwd },
      { onSuccess: () => router.push("/dashboard") },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center font-serif text-2xl mb-12">Invitta<span className="text-champagne"> · </span>RSVP</Link>
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Începe gratuit</p>
          <h1 className="mt-3 font-serif text-4xl">Creează invitația voastră</h1>
          <p className="mt-3 text-sm text-muted-foreground">Două minute. Fără card de credit.</p>
        </div>

        <form onSubmit={submit} className="mt-10 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Numele vostru</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ioana & Andrei"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Parolă</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={form.pwd}
              onChange={(e) => setForm({ ...form, pwd: e.target.value })}
              className="h-11"
            />
          </div>
          {register.error && (
            <Alert variant="destructive">
              <AlertDescription>{register.error.message}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" size="lg" disabled={register.isPending} className="w-full h-12">
            Creează contul
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Ai deja cont? <Link href="/login" className="text-foreground underline underline-offset-4 hover:text-champagne">Autentifică-te</Link>
        </p>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Sau <Link href="/modele" className="text-foreground underline underline-offset-4 hover:text-champagne">vezi mai întâi modelele</Link>
        </p>
      </div>
    </div>
  );
}
