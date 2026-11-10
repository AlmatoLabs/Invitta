# Invitta

Aplicație client–server pentru invitații digitale de nuntă: editor de invitație, pagină publică pentru
invitați, confirmări RSVP și așezarea la mese.

| Modul | Rol | Stack | Port |
| --- | --- | --- | --- |
| **`server-app`** | Backend (API REST) | Next.js 16 (route handlers) · TypeScript · Drizzle ORM · Postgres (Supabase) | 4000 |
| **`server-admin`** | Frontend (aplicația web) | Next.js 16 · React 19 · TypeScript · Tailwind 4 · shadcn/ui | 3000 |

Monorepo `pnpm` (workspaces). Browserul vorbește doar cu `server-admin`; cererile `/api/*` sunt
redirecționate (rewrite) către `server-app`, deci cookie-ul de sesiune este first-party și nu e nevoie de CORS.

```
invitta/
├─ server-app/
│  ├─ drizzle/                 migrări SQL generate
│  └─ src/
│     ├─ db/                   schema.ts · client.ts · migrate.ts · seed.ts
│     ├─ lib/                  auth (JWT în cookie) · http · ownership · validators
│     └─ app/api/              route handlers (vezi „API”)
└─ server-admin/
   ├─ public/images/           imaginile din prototip
   └─ src/
      ├─ app/                  rute (App Router): /, /modele, /login, /register,
      │                        /dashboard/*, /invitatie/[slug], /invitatie/preview
      ├─ components/           ui/ (shadcn), SiteHeader, InvitationRenderer …
      └─ lib/                  api client · session · queries · invitation-content · i18n · demos
```

## Pornire rapidă

Cerințe: Node 22+, pnpm 10+.

```bash
pnpm install

# 1. Baza de date (Supabase: Project Settings → Database → Connection string)
cp server-app/.env.example server-app/.env      # completează DATABASE_URL și AUTH_SECRET
pnpm db:migrate                                   # aplică migrările din server-app/drizzle
pnpm db:seed                                      # opțional: demo@invitta.ro / demo12345

# 2. Frontend
cp server-admin/.env.example server-admin/.env.local

# 3. Pornește ambele aplicații
pnpm dev                                          # server-admin :3000 + server-app :4000
```

Postgres local funcționează la fel (`postgres://postgres:postgres@localhost:5432/invitta`).
Pentru *transaction pooler*-ul Supabase (port 6543) setează `DATABASE_PREPARE=false`.

### Scripturi (din rădăcină)

`pnpm dev` · `pnpm build` · `pnpm typecheck` · `pnpm lint` ·
`pnpm db:generate` (după modificarea `schema.ts`) · `pnpm db:migrate` · `pnpm db:push` · `pnpm db:studio` · `pnpm db:seed`

## Model de date (Drizzle)

`users` → `invitations` (model ales, `slug` public, `content` JSONB = tot ce produce editorul) →
`guest_groups` (un răspuns RSVP: invitat/familie, status, nr. persoane, meniu, mesaj) → `guests`
(persoanele care se pot așeza la masă) ↔ `seating_tables`. Plus `invoices`.

Toate tabelele au **RLS activat, fără politici**: Supabase expune schema `public` prin Data API (PostgREST),
iar așa cheile anon/authenticated nu pot citi nimic. `server-app` se conectează ca owner al bazei și nu e afectat.

## API (`server-app`)

Autentificare: cookie `invitta_session` (JWT HS256, httpOnly, 30 zile). Parolele: bcrypt.
Orice resursă a unui cuplu este verificată pe proprietar (răspuns 404 pentru resurse străine).

| Metodă | Rută | Descriere |
| --- | --- | --- |
| POST | `/api/auth/register` · `/login` · `/logout` | cont + sesiune |
| GET | `/api/auth/me` | utilizatorul curent (`{user:null}` dacă nu e autentificat) |
| PATCH | `/api/me` · POST `/api/me/password` | profil, schimbare parolă |
| GET/POST | `/api/invitations` | listă / creare (modelul ales + conținut) |
| GET/PATCH/DELETE | `/api/invitations/:id` | citire / salvare editor (`content`, `modelSlug`, `slug`) |
| GET | `/api/invitations/:id/stats` | confirmați / în așteptare / refuzați |
| GET/POST | `/api/invitations/:id/guest-groups` | lista RSVP + adăugare invitat |
| PATCH/DELETE | `/api/guest-groups/:id` | status, nr. persoane, meniu · ștergere |
| GET/POST | `/api/invitations/:id/tables` | mesele (cu invitații așezați) / masă nouă |
| PATCH/DELETE | `/api/tables/:id` · PATCH `/api/guests/:id` | editare masă · așezare invitat (`tableId` sau `null`) |
| GET | `/api/invoices` | facturile contului |
| GET | `/api/public/invitations/:slug` | **public** – conținutul invitației |
| POST | `/api/public/invitations/:slug/rsvp` | **public** – răspunsul unui invitat |
| GET | `/api/health` | verificare conexiune DB |

## Ce s-a schimbat față de prototipul Lovable

- **TanStack Start + Vite + Cloudflare → Next.js 16 (App Router).** Rutele au aceleași URL-uri; fișierele
  `routeTree.gen.ts`, `router.tsx`, `server.ts`, `start.ts`, `wrangler.jsonc`, `vite.config.ts`, `bun.lock`, `.lovable/` au dispărut.
- **`localStorage` → Postgres.** Sesiunea, invitația (editorul salvează automat la 800 ms), lista RSVP și mesele
  sunt acum în baza de date. Datele fictive din prototip (invitați, mese, factură) nu mai sunt hardcodate.
- **Link de distribuire:** în loc de invitația codificată în URL (`#d=…`), linkul este `/invitatie/<slug>`,
  randat pe server (previzualizările din WhatsApp funcționează) cu formular RSVP real.
- **Un singur cuplu = o invitație activă.** „Alege acest model” creează invitația prima dată; apoi schimbă doar
  designul și păstrează conținutul (schema permite mai multe invitații).
- Pagina de modele are acum `metadata` server-side; paginile private (dashboard) nu.
- Adăugat: *Adaugă invitat*, schimbare status/ștergere în RSVP, export CSV, profil și parolă funcționale.

## De știut / pași următori

- **Imagini lipsă din arhivă:** `hero-couple`, `tpl-minimal-ivory`, `tpl-italian-romance` erau hostate de Lovable
  (`/__l5e/assets-v1/…`) și nu se aflau în zip. Sunt înlocuite temporar în `server-admin/public/images/` cu
  `hero-editorial`, `template-ivory`, `template-italian`. Pune fișierele originale sub aceleași nume.
- **Imagini încărcate de utilizator** sunt încă salvate ca `data:` URL în `content` (limită 12 MB/invitație).
  Următorul pas firesc: Supabase Storage.
- Lipsesc: rate limiting pe `/api/auth/*` și pe RSVP-ul public, resetare parolă, verificare email, plăți reale.
- Traducerea RO↔EN (`lib/i18n.ts`) rămâne cea din prototip (înlocuire de text în DOM).
- `pnpm lint` raportă avertismente `react-hooks/*` (reguli noi React Compiler) pe cod din prototip și din shadcn; nu blochează build-ul.
