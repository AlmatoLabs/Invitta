"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMOS } from "@/lib/demos";
import { findPlan } from "@/lib/plans";
import { useAuthActions } from "@/lib/session";

type Field = "name" | "email" | "pwd";
type Errors = Partial<Record<Field, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = "Introdu numele vostru.";
  if (!form.email.trim()) errors.email = "Introdu adresa de email.";
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = "Adresa de email nu pare corectă (ex. nume@exemplu.ro).";
  if (form.pwd.length < 8) errors.pwd = "Parola trebuie să aibă minimum 8 caractere.";
  return errors;
}

/** Pachetul și designul alese pe pagina principală (?plan=, ?design=). */
function useSelection() {
  const params = useSearchParams();
  const plan = findPlan(params.get("plan"));
  const design = DEMOS.find((d) => d.slug === params.get("design"));
  return { plan, design };
}

function Intro() {
  const { plan } = useSelection();
  const paid = plan !== undefined && plan.price > 0;
  return (
    <>
      <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{paid ? `Pachet ${plan.name}` : "Începe gratuit"}</p>
      <h1 className="mt-3 font-serif text-4xl">Creează invitația voastră</h1>
      <p className="mt-3 text-sm text-muted-foreground">{paid ? "Două minute pentru a crea contul." : "Două minute. Fără card de credit."}</p>
    </>
  );
}

function SelectionSummary() {
  const { plan, design } = useSelection();
  return (
    <>
      {/* Câmpuri ascunse: alegerea se trimite odată cu formularul. */}
      <input type="hidden" name="plan" value={plan?.slug ?? ""} />
      <input type="hidden" name="design" value={design?.slug ?? ""} />
      {(plan || design) && (
        <div className="space-y-1 rounded-[4px] border border-border bg-card px-4 py-3 text-sm">
          {plan && (
            <p className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span>Pachet: {plan.name} · €{plan.price}</span>
              <Link href="/#pricing" className="inline-flex min-h-8 items-center text-muted-foreground underline underline-offset-4 hover:text-foreground">Schimbă</Link>
            </p>
          )}
          {design && (
            <p className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span>Design: {design.model}</span>
              <Link href="/modele" className="inline-flex min-h-8 items-center text-muted-foreground underline underline-offset-4 hover:text-foreground">Schimbă</Link>
            </p>
          )}
        </div>
      )}
    </>
  );
}

const labelCls = "text-[13px] uppercase tracking-[0.2em] text-muted-foreground";
const inputCls = "h-11 placeholder:text-muted-foreground/60";

function FieldError({ id, msg }: { id: string; msg?: string }) {
  return (
    <p id={id} role="alert" className="text-sm text-destructive empty:hidden">
      {msg}
    </p>
  );
}

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState<Record<Field, string>>({ name: "", email: "", pwd: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { register } = useAuthActions();

  const set = (field: Field, value: string) => {
    const next = { ...form, [field]: value };
    setForm(next);
    if (submitted) setErrors(validate(next));
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (register.isPending) return;
    setSubmitted(true);
    const found = validate(form);
    setErrors(found);
    const first = (["name", "email", "pwd"] as Field[]).find((f) => found[f]);
    if (first) {
      document.getElementById(first === "pwd" ? "password" : first)?.focus();
      return;
    }
    const data = new FormData(e.currentTarget);
    const design = String(data.get("design") ?? "") || undefined;
    // TODO(backend): API-ul nu are încă un câmp pentru pachet; `data.get("plan")` trebuie trimis
    // la /auth/register (sau la checkout) când există suport.
    register.mutate(
      { name: form.name.trim(), email: form.email.trim(), password: form.pwd, modelSlug: design },
      { onSuccess: () => router.push(design ? "/dashboard/invitatie" : "/dashboard") },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center font-serif text-2xl mb-12">Invitta<span className="text-champagne"> · </span>RSVP</Link>
        <div className="text-center">
          <Suspense fallback={<h1 className="font-serif text-4xl">Creează invitația voastră</h1>}>
            <Intro />
          </Suspense>
        </div>

        <form onSubmit={submit} noValidate className="mt-10 space-y-6">
          <Suspense fallback={null}>
            <SelectionSummary />
          </Suspense>
          <div className="space-y-2">
            <Label htmlFor="name" className={labelCls}>Numele vostru</Label>
            <Input
              id="name"
              autoComplete="name"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="ex. Ioana & Andrei"
              aria-invalid={!!errors.name}
              aria-describedby="name-error"
              className={inputCls}
            />
            <FieldError id="name-error" msg={errors.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className={labelCls}>Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
              className={inputCls}
            />
            <FieldError id="email-error" msg={errors.email} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className={labelCls}>Parolă</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                value={form.pwd}
                onChange={(e) => set("pwd", e.target.value)}
                aria-invalid={!!errors.pwd}
                aria-describedby="password-hint password-error"
                className={`${inputCls} pr-24`}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                aria-pressed={showPwd}
                aria-controls="password"
                className="absolute inset-y-0 right-0 flex min-w-20 items-center justify-center rounded-r-md px-3 text-[13px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {showPwd ? "Ascunde" : "Arată"}
              </button>
            </div>
            <p id="password-hint" className="text-[13px] text-muted-foreground">Minimum 8 caractere</p>
            <FieldError id="password-error" msg={errors.pwd} />
          </div>
          {register.error && (
            <Alert variant="destructive">
              <AlertDescription>{register.error.message}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" size="lg" disabled={register.isPending} aria-busy={register.isPending} className="w-full h-12">
            {register.isPending ? "Se creează contul…" : "Creează contul"}
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
