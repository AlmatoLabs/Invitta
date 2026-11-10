import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Invitta RSVP</p>
        <h1 className="mt-6 font-serif text-7xl text-foreground">404</h1>
        <h2 className="mt-4 font-serif text-2xl text-foreground">Pagină negăsită</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Pagina pe care o cauți nu există sau a fost mutată.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-[4px] bg-primary px-7 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-all hover:opacity-90"
          >
            Înapoi acasă
          </Link>
        </div>
      </div>
    </div>
  );
}
