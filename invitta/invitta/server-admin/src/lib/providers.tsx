"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { applyLanguage, getStoredLang, LANG_EVENT, LANG_KEY } from "@/lib/i18n";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } } }),
  );

  // Whole-site RO → EN text swap (see lib/i18n.ts). Runs after hydration finishes.
  useEffect(() => {
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      if (document.readyState !== "complete") {
        setTimeout(start, 100);
        return;
      }
      const idle = (window as any).requestIdleCallback ?? ((f: () => void) => setTimeout(f, 200));
      idle(() => {
        if (!cancelled) applyLanguage(getStoredLang());
      });
    };
    start();
    // Keep other open tabs (e.g. the preview) in sync with the chosen language.
    const onStorage = (e: StorageEvent) => {
      if (e.key === LANG_KEY) {
        applyLanguage(getStoredLang());
        window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: getStoredLang() }));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
