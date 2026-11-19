type Props = {
  brideName?: string;
  groomName?: string;
  date?: string;
  location?: string;
  compact?: boolean;
};

export function InvitationPreview({
  brideName = "Ioana",
  groomName = "Andrei",
  date = "14 Iunie 2026",
  location = "Domeniul Manasia",
  compact = false,
}: Props) {
  return (
    <div className="tpl-scope relative flex h-full w-full flex-col items-center justify-between bg-tpl-ivory px-6 py-10 text-center text-tpl-noir">
      <div className="text-xs uppercase tracking-[0.35em] text-tpl-stone animate-shimmer">
        Vă invităm la nunta noastră
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="font-serif italic text-2xl text-tpl-noir/70">{brideName}</div>
        <div className="font-serif text-3xl text-tpl-champagne">&</div>
        <div className="font-serif italic text-2xl text-tpl-noir/70">{groomName}</div>
      </div>

      <div className="h-px bg-tpl-border w-16" />

      <div className="space-y-2">
        <div className="font-serif text-base text-tpl-noir">{date}</div>
        <div className="text-xs uppercase tracking-[0.25em] text-tpl-stone">{location}</div>
      </div>

      {!compact && (
        <span className="rounded-[4px] border border-tpl-noir/60 px-5 py-2 text-xs uppercase tracking-[0.25em]">
          Confirmă prezența
        </span>
      )}
    </div>
  );
}
