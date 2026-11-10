import type { Metadata } from "next";
import { ModelsView } from "./models-view";

export const metadata: Metadata = {
  title: "Modele de invitații",
  description: "Vezi toate modelele Invitta și deschide demo-ul oricărui model, fără cont.",
  openGraph: {
    title: "Modele de invitații — Invitta",
    description: "Vezi toate modelele Invitta și deschide demo-ul oricărui model, fără cont.",
    type: "website",
  },
};

export default function ModelsPage() {
  return <ModelsView />;
}
