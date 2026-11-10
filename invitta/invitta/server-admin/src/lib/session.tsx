"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api, type ApiUser, type Invitation, type InvitationSummary, type MeResponse } from "./api";
import { DEFAULT_CONTENT } from "./invitation-content";

/** "Maria & Paul" → starting names for the new invitation; anything else keeps the defaults. */
function initialContent(accountName: string | undefined) {
  const parts = (accountName ?? "").split(/\s*(?:&|\bși\b|\bsi\b)\s*/i).map((p) => p.trim());
  if (parts.length !== 2 || !parts[0] || !parts[1]) return DEFAULT_CONTENT;
  return {
    ...DEFAULT_CONTENT,
    brideFirst: parts[0],
    groomFirst: parts[1],
    headerReplacement: `${parts[0]} & ${parts[1]}`,
  };
}

export type Session = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  /** True once the couple has picked a model (i.e. has at least one invitation). */
  hasInvite: boolean;
  /** The invitation the dashboard works on (the most recently created one). */
  invitation: InvitationSummary | null;
};

export const ME_KEY = ["me"] as const;

function toSession(me: MeResponse | undefined): Session | null {
  if (!me?.user) return null;
  const invitation = me.invitations.at(-1) ?? null;
  return { ...me.user, hasInvite: me.invitations.length > 0, invitation };
}

/** `loading` is true until the first /auth/me answer arrives (so pages can avoid a signed-out flash). */
export function useSessionState(): { session: Session | null; loading: boolean } {
  const q = useQuery({
    queryKey: ME_KEY,
    queryFn: () => api<MeResponse>("/auth/me"),
    staleTime: 60_000,
  });
  return { session: toSession(q.data), loading: q.isPending };
}

export function useSession(): Session | null {
  return useSessionState().session;
}

export function useAuthActions() {
  const qc = useQueryClient();
  const router = useRouter();
  const setMe = (me: MeResponse) => qc.setQueryData(ME_KEY, me);

  const login = useMutation({
    mutationFn: (b: { email: string; password: string }) =>
      api<MeResponse>("/auth/login", { body: b }),
    onSuccess: setMe,
  });
  const register = useMutation({
    mutationFn: (b: { name: string; email: string; password: string }) =>
      api<MeResponse>("/auth/register", { body: b }),
    onSuccess: setMe,
  });
  const logout = async () => {
    await api("/auth/logout", { method: "POST", body: {} }).catch(() => {});
    qc.clear();
    qc.setQueryData(ME_KEY, { user: null, invitations: [] } satisfies MeResponse);
    router.push("/");
  };
  return { login, register, logout };
}

/**
 * Picks a collection model. A couple has one active invitation: the first pick creates it (with the
 * default content), later picks switch its design and keep everything they already wrote.
 */
export function useChooseInvitation() {
  const qc = useQueryClient();
  const session = useSession();
  const existingId = session?.invitation?.id;
  return useMutation({
    mutationFn: (modelSlug: string) =>
      existingId
        ? api<{ invitation: Invitation }>(`/invitations/${existingId}`, { method: "PATCH", body: { modelSlug } })
        : api<{ invitation: Invitation }>("/invitations", {
            body: { modelSlug, content: initialContent(session?.name) },
          }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ME_KEY });
      if (existingId) await qc.invalidateQueries({ queryKey: ["invitation", existingId] });
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (b: { name?: string; email?: string; phone?: string | null }) =>
      api<{ user: ApiUser }>("/me", { method: "PATCH", body: b }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ME_KEY }),
  });
}
