"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/** Mobile-only bar with the main action; shows once the visitor has scrolled past the hero. */
export function MobileCreateCta() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div
      inert={!visible}
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-border bg-ivory/95 px-4 py-3 backdrop-blur-xl transition-transform duration-300 md:hidden ${visible ? "translate-y-0" : "translate-y-full"}`}
    >
      <Button asChild className="h-12 w-full shadow-none">
        <Link href="/register">Creează invitația</Link>
      </Button>
    </div>
  );
}
