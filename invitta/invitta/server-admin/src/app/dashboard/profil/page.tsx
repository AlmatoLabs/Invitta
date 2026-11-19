"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useSession, useUpdateProfile } from "@/lib/session";

const label = "text-xs font-medium text-muted-foreground";

export default function Profile() {
  const session = useSession();
  const update = useUpdateProfile();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [saved, setSaved] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pw, setPw] = useState({ cur: "", next: "", confirm: "" });

  useEffect(() => {
    if (session) setForm({ name: session.name, email: session.email, phone: session.phone ?? "" });
  }, [session]);

  const save = (e: FormEvent) => {
    e.preventDefault();
    update.mutate(
      { name: form.name, email: form.email, phone: form.phone || null },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        },
      },
    );
  };

  const changePw = async (e: FormEvent) => {
    e.preventDefault();
    if (pw.next.length < 8) return setPwMsg("Parola nouă trebuie să aibă minim 8 caractere.");
    if (pw.next !== pw.confirm) return setPwMsg("Parolele nu coincid.");
    try {
      await api("/me/password", { body: { current: pw.cur, next: pw.next } });
      setPw({ cur: "", next: "", confirm: "" });
      setPwMsg("Parola a fost schimbată.");
    } catch (err) {
      setPwMsg(err instanceof Error ? err.message : "A apărut o eroare.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="eyebrow">Contul tău</p>
      <h1 className="mt-3 font-serif text-5xl">Profilul meu</h1>

      <form onSubmit={save} className="mt-12 space-y-6">
        <h2 className="font-serif text-2xl">Detaliile mele</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className={label}>Nume</Label>
            <Input id="name" required className="h-11" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className={label}>Email</Label>
            <Input id="email" type="email" required className="h-11" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className={label}>Telefon</Label>
            <Input id="phone" className="h-11" placeholder="07xx xxx xxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
        {update.error && (
          <Alert variant="destructive">
            <AlertDescription>{update.error.message}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" size="lg" disabled={update.isPending}>{saved ? "✓ Salvat" : "Salvează"}</Button>
      </form>

      <form onSubmit={changePw} className="mt-16 space-y-6 border-t border-border pt-12">
        <h2 className="font-serif text-2xl">Schimbă parola</h2>
        <div className="space-y-2">
          <Label htmlFor="pw-cur" className={label}>Parola curentă</Label>
          <Input id="pw-cur" type="password" autoComplete="current-password" required className="h-11" value={pw.cur} onChange={(e) => setPw({ ...pw, cur: e.target.value })} />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pw-next" className={label}>Parola nouă</Label>
            <Input id="pw-next" type="password" autoComplete="new-password" required className="h-11" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pw-confirm" className={label}>Confirmă parola</Label>
            <Input id="pw-confirm" type="password" autoComplete="new-password" required className="h-11" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
          </div>
        </div>
        {pwMsg && (
          <Alert>
            <AlertDescription>{pwMsg}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" variant="outline" size="lg">Schimbă parola</Button>
      </form>
    </div>
  );
}
