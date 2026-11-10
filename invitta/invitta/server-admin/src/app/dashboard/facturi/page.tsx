"use client";

import { Button } from "@/components/ui/button";
import { useInvoices } from "@/lib/queries";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
const fmtAmount = (cents: number, currency: string) =>
  `${(cents / 100).toLocaleString("ro-RO", { maximumFractionDigits: 2 })} ${currency === "RON" ? "lei" : currency}`;

export default function Invoices() {
  const { data: invoices, isPending } = useInvoices();
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Contul tău</p>
      <h1 className="mt-3 font-serif text-5xl">Facturile mele</h1>
      <div className="mt-12 border-t border-border">
        {invoices?.map((i) => (
          <div key={i.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-6">
            <div>
              <p className="font-serif text-xl">{i.plan}</p>
              <p className="text-xs text-muted-foreground"><span data-no-translate>{i.number}</span> · {fmtDate(i.issuedAt)}</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm">{fmtAmount(i.amountCents, i.currency)}</span>
              <Button variant="outline">Descarcă PDF</Button>
            </div>
          </div>
        ))}
        {!isPending && invoices?.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">Nu ai nicio factură încă.</p>
        )}
      </div>
    </div>
  );
}
