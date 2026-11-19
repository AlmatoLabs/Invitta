"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type DragEvent } from "react";
import { Check, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { api, type GuestGroup, type SeatingTable as Table, type TableShape as Shape } from "@/lib/api";
import { qk, useGuestGroups, useInvitation, useTables } from "@/lib/queries";
import { useSession } from "@/lib/session";

type NewTable = { name: string; seats: number; shape: Shape; color: string; notes: string };

const TABLE_COLORS = [
  "#C9A876", "#7A8B5C", "#B89E8A", "#8FA1B3", "#A77C7C", "#9B8AA8", "#6E7F6A", "#2A2A2A",
];

/** Culoarea mesei e aleasă de miri → alegem textul (ink / paper) cu contrastul mai bun. */
function luminance(hex: string): number | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return null;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const n = parseInt(m[1], 16);
  return 0.2126 * lin(((n >> 16) & 255) / 255) + 0.7152 * lin(((n >> 8) & 255) / 255) + 0.0722 * lin((n & 255) / 255);
}
// Must match --ink / --paper in globals.css.
const L_INK = luminance("#3A2A2A")!;
const L_PAPER = luminance("#FDFAF9")!;
function readableOn(hex: string): string {
  const L = luminance(hex);
  if (L === null) return "var(--paper)";
  return (L + 0.05) / (L_INK + 0.05) >= (L_PAPER + 0.05) / (L + 0.05) ? "var(--ink)" : "var(--paper)";
}

const SHAPES: { id: Shape; label: string }[] = [
  { id: "round", label: "Rotundă" },
  { id: "rect", label: "Dreptung." },
  { id: "square", label: "Pătrat" },
  { id: "oval", label: "Ovală" },
  { id: "presidium", label: "Prezidiu" },
];

export default function Tables() {
  const session = useSession();
  const invitationId = session?.invitation?.id;
  const qc = useQueryClient();
  const { data: invitation } = useInvitation(invitationId);
  const { data: tables = [] } = useTables(invitationId);
  const { data: groups = [] } = useGuestGroups(invitationId);
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(100);
  const [selected, setSelected] = useState<string | null>(null);
  const [dragged, setDragged] = useState<{ guestId: string; from: string | "pool" } | null>(null);
  const [error, setError] = useState("");

  const tablesKey = qk.tables(invitationId);
  const groupsKey = qk.groups(invitationId);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: tablesKey });
    qc.invalidateQueries({ queryKey: groupsKey });
  };
  const run = async (fn: () => Promise<unknown>) => {
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "A apărut o eroare.");
    } finally {
      refresh();
    }
  };

  const assigned = useMemo(() => new Set(tables.flatMap((t) => t.guests.map((g) => g.id))), [tables]);
  const totalSeats = tables.reduce((a, t) => a + t.seats, 0);
  const totalAssigned = tables.reduce((a, t) => a + t.guests.length, 0);
  const visibleGroups = groups
    .map((g: GuestGroup) => ({ ...g, members: g.members.filter((m) => m.name.toLowerCase().includes(search.toLowerCase())) }))
    .filter((g) => g.members.length > 0);

  const onDragStart = (guestId: string, from: string | "pool") => setDragged({ guestId, from });

  /** Seats a guest (or sends them back to the pool with `null`). Optimistic, rolled back on error. */
  const seat = (guestId: string, tableId: string | null) => {
    const guest =
      groups.flatMap((g) => g.members).find((m) => m.id === guestId);
    if (!guest) return;
    qc.setQueryData<Table[]>(tablesKey, (old = []) =>
      old.map((t) => {
        const without = t.guests.filter((g) => g.id !== guestId);
        return t.id === tableId ? { ...t, guests: [...without, { id: guestId, name: guest.name }] } : { ...t, guests: without };
      }),
    );
    run(() => api(`/guests/${guestId}`, { method: "PATCH", body: { tableId } }));
  };

  const onDrop = (e: DragEvent, toId: string) => {
    e.preventDefault();
    if (!dragged) return;
    const table = tables.find((t) => t.id === toId);
    if (!table || table.guests.some((g) => g.id === dragged.guestId) || table.guests.length >= table.seats) return;
    seat(dragged.guestId, toId);
    setDragged(null);
  };
  const onDropPool = (e: DragEvent) => {
    e.preventDefault();
    if (!dragged || dragged.from === "pool") return;
    seat(dragged.guestId, null);
    setDragged(null);
  };

  const addTable = (t: NewTable) =>
    run(async () => {
      const { table } = await api<{ table: Table }>(`/invitations/${invitationId}/tables`, { body: t });
      setSelected(table.id);
    });
  const removeTable = (id: string) => run(() => api(`/tables/${id}`, { method: "DELETE" }));
  const updateTable = (id: string, patch: Partial<Table>) =>
    run(() => api(`/tables/${id}`, { method: "PATCH", body: patch }));

  const c = invitation?.content ?? {};
  const couple = [c.brideFirst, c.groomFirst].filter(Boolean).join(" & ");
  const subtitle = ["Invitațiile mele", couple, typeof c.dateLabel === "string" ? c.dateLabel : ""].filter(Boolean).join(" · ");

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-background/90 backdrop-blur-xl px-4 sm:px-8 py-5">
        <p className="eyebrow">
          {subtitle}
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Așezarea la mese</h1>
      </div>

      {/* Toolbar */}
      <div className="border-b border-border bg-card px-4 sm:px-8 py-3 flex flex-wrap items-center gap-2">
        <NewTableDialog onCreate={addTable} />
        <ToolbarButton icon="＋">Element nou</ToolbarButton>
        <ToolbarButton icon="◐">Grup nou</ToolbarButton>
        <Separator orientation="vertical" className="mx-2 h-6 hidden sm:block" />
        <ToolbarButton icon="▦">Sumar</ToolbarButton>
        <ToolbarButton icon="↗">Export</ToolbarButton>
        <ToolbarButton icon="◉">3D</ToolbarButton>
        <ToolbarButton icon="?">Ajutor</ToolbarButton>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-success-bar" aria-hidden="true" /> Salvat automat
        </div>
      </div>

      {error && (
        <p role="alert" className="border-b border-border bg-error-bg px-4 py-2 text-sm text-destructive sm:px-8">{error}</p>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr]">
        {/* Left: guest pool */}
        <aside className="border-r border-border bg-card/50 flex flex-col max-h-[calc(100vh-200px)]">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">⌕</span>
              <Input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Caută invitat..."
                className="h-auto w-full rounded-xl border-border bg-background pl-9 pr-4 py-2.5 text-sm focus-visible:border-ring"
              />
            </div>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropPool}
            className="flex-1 overflow-y-auto px-3 py-4"
          >
            <p className="px-2 text-xs font-medium text-muted-foreground mb-3">
              Neasignați ({visibleGroups.reduce((a, g) => a + g.members.filter((m) => !assigned.has(m.id)).length, 0)})
            </p>

            <div className="space-y-4">
              {visibleGroups.map((g) => (
                <div key={g.id}>
                  <p className="px-3 py-1 text-xs font-medium text-muted-foreground border-b border-border/60 mb-1">
                    {g.name}
                  </p>
                  {g.members.map((m) => {
                    const isAssigned = assigned.has(m.id);
                    return (
                      <div
                        key={m.id}
                        draggable={!isAssigned}
                        onDragStart={() => !isAssigned && onDragStart(m.id, "pool")}
                        className={`mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                          isAssigned ? "opacity-40 line-through" : "cursor-grab bg-transparent hover:bg-blush"
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full border border-muted-foreground/40" />
                        <span className="flex-1 truncate">{m.name}</span>
                        {m.isPartner && (
                          <Badge variant="secondary" className="text-xs font-normal text-muted-foreground bg-background hover:bg-background rounded-[4px] px-2 py-0.5 border-0">
                            partener
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <main className="relative bg-paper overflow-auto">
          <div
            className="min-h-full p-8"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--line) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          >
            <div
              className="flex flex-wrap gap-10 origin-top-left transition-transform"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              {tables.map((t) => (
                <TableShape
                  key={t.id}
                  table={t}
                  selected={selected === t.id}
                  onSelect={() => setSelected(t.id)}
                  onDrop={(e) => onDrop(e, t.id)}
                  onDragGuest={(guestId) => onDragStart(guestId, t.id)}
                  onRemove={() => removeTable(t.id)}
                  onSeatsChange={(seats) => updateTable(t.id, { seats })}
                />
              ))}
              {tables.length === 0 && (
                <div className="m-auto text-center text-muted-foreground py-32">
                  <p className="font-serif text-2xl">Nicio masă încă</p>
                  <p className="mt-2 text-sm">Folosește „Masă nouă” pentru a începe</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer stats + zoom */}
          <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-border bg-background/95 backdrop-blur-xl px-6 py-3">
            <p className="text-xs text-muted-foreground">
              <span className="text-base font-medium text-foreground">{totalAssigned}</span> / {totalSeats} locuri ocupate ·{" "}
              <span className="text-base font-medium text-foreground">{tables.length}</span> mese
            </p>
            <div className="flex items-center gap-1">
              <ZoomBtn onClick={() => setZoom(Math.max(50, zoom - 10))}>−</ZoomBtn>
              <span className="text-xs tabular-nums w-12 text-center">{zoom}%</span>
              <ZoomBtn onClick={() => setZoom(Math.min(150, zoom + 10))}>＋</ZoomBtn>
              <ZoomBtn onClick={() => setZoom(100)}>⟲</ZoomBtn>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ToolbarButton({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <Button variant="secondary" size="sm" className="rounded-full px-4 py-2 h-auto text-xs font-normal shadow-none">
      <span aria-hidden="true" className="text-editorial">{icon}</span> {children}
    </Button>
  );
}

function ZoomBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} className="h-8 w-8 rounded-full border border-border bg-transparent text-sm font-normal">
      {children}
    </Button>
  );
}

/* ---------------- Table Shape ---------------- */

function TableShape({
  table, selected, onSelect, onDrop, onDragGuest, onRemove, onSeatsChange,
}: {
  table: Table; selected: boolean;
  onSelect: () => void;
  onDrop: (e: DragEvent) => void;
  onDragGuest: (guestId: string) => void;
  onRemove: () => void;
  onSeatsChange: (n: number) => void;
}) {
  const free = table.seats - table.guests.length;

  const seatPositions = useMemo(() => {
    if (table.shape === "round" || table.shape === "oval") {
      return Array.from({ length: table.seats }).map((_, i) => {
        const angle = (i / table.seats) * Math.PI * 2 - Math.PI / 2;
        const rx = table.shape === "oval" ? 130 : 100;
        const ry = 100;
        return { x: Math.cos(angle) * rx, y: Math.sin(angle) * ry, angle };
      });
    }
    // Rect / square / presidium → seats on top + bottom
    const top = Math.ceil(table.seats / 2);
    const bot = table.seats - top;
    const width = table.shape === "square" ? 140 : table.shape === "presidium" ? 260 : 220;
    const stepT = top > 1 ? width / (top - 1) : 0;
    const stepB = bot > 1 ? width / (bot - 1) : 0;
    const positions = [
      ...Array.from({ length: top }).map((_, i) => ({ x: -width / 2 + i * stepT, y: -75, angle: -Math.PI / 2 })),
      ...Array.from({ length: bot }).map((_, i) => ({ x: -width / 2 + i * stepB, y: 75, angle: Math.PI / 2 })),
    ];
    return positions;
  }, [table.shape, table.seats]);

  const shapeBox = () => {
    const base = "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center font-medium transition-all";
    const style = { background: table.color, color: readableOn(table.color) };
    switch (table.shape) {
      case "round":
        return <div className={`${base} h-32 w-32 rounded-full`} style={style}>
          <span className="text-sm">{table.name}</span>
          <span className="text-xs">{table.guests.length}/{table.seats}</span>
        </div>;
      case "oval":
        return <div className={`${base} h-28 w-48 rounded-[50%]`} style={style}>
          <span className="text-sm">{table.name}</span>
          <span className="text-xs">{table.guests.length}/{table.seats}</span>
        </div>;
      case "square":
        return <div className={`${base} h-28 w-28 rounded-md`} style={style}>
          <span className="text-sm">{table.name}</span>
          <span className="text-xs">{table.guests.length}/{table.seats}</span>
        </div>;
      case "presidium":
        return <div className={`${base} h-20 w-72 rounded-md`} style={style}>
          <span className="text-sm">{table.name} · Prezidiu</span>
          <span className="text-xs">{table.guests.length}/{table.seats}</span>
        </div>;
      case "rect":
      default:
        return <div className={`${base} h-24 w-56 rounded-md`} style={style}>
          <span className="text-sm">{table.name}</span>
          <span className="text-xs">{table.guests.length}/{table.seats}</span>
        </div>;
    }
  };

  return (
    <div
      onClick={onSelect}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={`group relative h-[300px] w-[300px] rounded-md transition-all ${
        selected ? "bg-blush-2 ring-2 ring-primary ring-offset-2 ring-offset-paper" : ""
      }`}
    >
      <div className="absolute inset-0">
        {shapeBox()}
        {/* Seats */}
        {seatPositions.map((p, i) => {
          const guest = table.guests[i];
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))` }}
            >
              {guest ? (
                <div
                  draggable
                  onDragStart={() => onDragGuest(guest.id)}
                  className="cursor-grab rounded-md bg-card border border-border px-2 py-1 text-xs whitespace-nowrap max-w-[112px] truncate luxe-shadow"
                  title={guest.name}
                >
                  {guest.name}
                </div>
              ) : (
                <div className="h-6 w-6 rounded border border-dashed border-muted-foreground/40 bg-card/60" />
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      {selected && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 whitespace-nowrap rounded-full border border-primary bg-card px-2 py-1 text-xs text-foreground shadow-sm">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onSeatsChange(Math.max(1, table.seats - 1)); }} aria-label="Un loc mai puțin" className="h-6 w-6 rounded-full hover:bg-blush">−</Button>
          <span className="px-1 tabular-nums">{table.seats}</span>
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onSeatsChange(table.seats + 1); }} aria-label="Un loc în plus" className="h-6 w-6 rounded-full hover:bg-blush">＋</Button>
          <Separator orientation="vertical" className="mx-1 h-3 bg-border" />
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onRemove(); }} className="h-6 rounded-full px-2 text-xs font-normal text-muted-foreground hover:bg-error-bg hover:text-destructive"><Trash2 aria-hidden className="size-3.5!" />Șterge</Button>
        </div>
      )}

      {free > 0 && (
        <div className="absolute bottom-2 right-2 text-xs font-medium text-editorial">
          {free} libere
        </div>
      )}
    </div>
  );
}

/* ---------------- New Table Dialog ---------------- */

function NewTableDialog({ onCreate }: { onCreate: (t: NewTable) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Masa nouă");
  const [seats, setSeats] = useState(8);
  const [shape, setShape] = useState<Shape>("round");
  const [color, setColor] = useState(TABLE_COLORS[0]);
  const [notes, setNotes] = useState("");

  const submit = () => {
    onCreate({ name, seats, shape, color, notes });
    setOpen(false);
    setName("Masa nouă");
    setSeats(8);
    setShape("round");
    setColor(TABLE_COLORS[0]);
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="px-4 py-2 h-auto text-xs font-medium">
          <span aria-hidden="true">＋</span> Masă nouă
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Masă nouă</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          <div>
            <Label htmlFor="table-name" className="text-xs font-medium text-muted-foreground">Nume masă *</Label>
            <Input id="table-name" value={name} onChange={(e) => setName(e.target.value)}
              className="mt-2 h-auto w-full rounded-xl border-border bg-card px-4 py-3 text-sm focus-visible:border-ring" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="table-seats" className="text-xs font-medium text-muted-foreground">Capacitate *</Label>
              <Input id="table-seats" type="number" min={1} max={30} value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="mt-2 h-auto w-full rounded-xl border-border bg-card px-4 py-3 text-sm focus-visible:border-ring" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Culoare</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {TABLE_COLORS.map((c) => (
                  <Button
                    key={c} type="button" variant="ghost" size="icon" onClick={() => setColor(c)}
                    aria-label={c}
                    aria-pressed={color === c}
                    className={`h-7 w-7 rounded-full border-2 transition-transform duration-150 hover:scale-110 ${color === c ? "border-primary scale-110" : "border-transparent"}`}
                    style={{ background: c, color: readableOn(c) }}
                  >
                    {color === c && <Check aria-hidden />}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium text-muted-foreground">Formă</Label>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {SHAPES.map((s) => (
                <Button key={s.id} type="button" variant="ghost" aria-pressed={shape === s.id} onClick={() => setShape(s.id)}
                  className={`flex h-auto flex-col items-center gap-2 rounded-xl border-2 p-3 shadow-none transition ${
                    shape === s.id ? "border-primary bg-blush-2 hover:bg-blush-2" : "border-border bg-transparent hover:bg-blush"
                  }`}>
                  <ShapeIcon shape={s.id} />
                  <span className="text-xs font-normal text-muted-foreground">{s.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="table-notes" className="text-xs font-medium text-muted-foreground">Note (opțional)</Label>
            <Textarea id="table-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Note despre această masă..."
              className="mt-2 w-full rounded-xl border-border bg-card px-4 py-3 text-sm focus-visible:border-ring resize-none" />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={() => setOpen(false)} className="px-5 py-2.5 h-auto">
            Anulează
          </Button>
          <Button onClick={submit} className="px-6 py-2.5 h-auto">
            Salvează
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ShapeIcon({ shape }: { shape: Shape }) {
  const cls = "border-2 border-ink/50";
  switch (shape) {
    case "round": return <div className={`${cls} h-6 w-6 rounded-full`} />;
    case "rect": return <div className={`${cls} h-4 w-8 rounded`} />;
    case "square": return <div className={`${cls} h-6 w-6 rounded`} />;
    case "oval": return <div className={`${cls} h-4 w-8 rounded-full`} />;
    case "presidium": return <div className={`${cls} h-3 w-9 rounded-sm`} />;
  }
}
