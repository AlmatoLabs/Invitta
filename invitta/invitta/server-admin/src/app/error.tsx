"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl text-foreground">Ceva nu a mers bine</h1>
        <p className="mt-3 text-base text-foreground">Reîncarcă pagina sau întoarce-te acasă.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={reset} className="px-6">
            Reîncearcă
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full bg-card px-6">
            <Link href="/">Acasă</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
