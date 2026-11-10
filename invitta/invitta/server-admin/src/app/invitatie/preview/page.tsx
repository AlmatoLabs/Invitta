"use client";

import { InvitationRenderer } from "@/components/InvitationRenderer";
import { useInvitation } from "@/lib/queries";
import { useSessionState } from "@/lib/session";

/** The couple's own, signed-in view of their saved invitation. */
export default function PreviewPage() {
  const { session, loading } = useSessionState();
  const { data: invitation, isPending } = useInvitation(session?.invitation?.id);

  if (loading || (session?.invitation && isPending)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fafaf6" }}>
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Se încarcă…</p>
      </div>
    );
  }
  return <InvitationRenderer content={invitation?.content ?? {}} />;
}
