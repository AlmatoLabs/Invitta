import type { ReactNode } from "react";

export function PhoneMockup({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto ${className}`}>
      <div className="relative w-[280px] sm:w-[320px] rounded-[3rem] bg-noir p-3 luxe-shadow">
        <div className="absolute left-1/2 top-3 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-noir" />
        <div className="overflow-hidden rounded-[2.4rem] bg-ivory aspect-[9/19]">
          {children}
        </div>
      </div>
    </div>
  );
}
