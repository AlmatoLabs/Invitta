import { IMG } from "@/lib/assets";


export type SectionKey =
  | "hero"
  | "countdown"
  | "couple"
  | "parents"
  | "civil"
  | "religious"
  | "party"
  | "story"
  | "gallery"
  | "thanks"
  | "rsvp";

export type Section = { key: SectionKey; label: string; enabled: boolean };

export const DEFAULT_SECTIONS: Section[] = [
  { key: "hero", label: "Prima pagină", enabled: true },
  { key: "countdown", label: "Numărătoare inversă", enabled: true },
  { key: "couple", label: "Despre sărbătoriți", enabled: true },
  { key: "parents", label: "Părinții și nașii", enabled: true },
  { key: "civil", label: "Cununia civilă", enabled: false },
  { key: "religious", label: "Cununia religioasă", enabled: true },
  { key: "party", label: "Petrecerea", enabled: true },
  { key: "story", label: "Povestea voastră", enabled: true },
  { key: "gallery", label: "Galerie foto", enabled: true },
  { key: "thanks", label: "Mulțumire", enabled: true },
  { key: "rsvp", label: "Confirmare RSVP", enabled: true },
];

export type InvitationContent = {
  // hero
  heroImage: string;
  heroOverlay: number;
  heroIntro: string;
  heroSmall: string;
  brideFirst: string;
  brideLast: string;
  groomFirst: string;
  groomLast: string;
  headerFont: string;
  headerReplacement: string;
  // countdown
  date: string;
  time: string;
  dateLabel: string;
  // parents
  parentsLabel: string;
  parentsNames: string;
  godparentsLabel: string;
  godparentsNames: string;
  // civil
  civilVenue: string;
  civilAddress: string;
  civilCity: string;
  civilDate: string;
  // religious
  religiousVenue: string;
  religiousAddress: string;
  religiousCity: string;
  religiousDate: string;
  // party
  partyVenue: string;
  partyAddress: string;
  partyCity: string;
  partyDate: string;
  // story / description
  storyTitle: string;
  storyText: string;
  youtubeId: string;
  // thanks
  thanksTitle: string;
  thanksText: string;
  // rsvp
  rsvpDeadline: string;
  askMenu: boolean;
  askPeople: boolean;
  // general
  theme: string;
  // sections
  sections: Section[];
};

export const DEFAULT_CONTENT: InvitationContent = {
  heroImage: IMG.hero,
  heroOverlay: 40,
  heroIntro: "Vă invităm la nunta noastră",
  heroSmall: "♡",
  brideFirst: "Ioana",
  brideLast: "",
  groomFirst: "Andrei",
  groomLast: "",
  headerFont: "cormorant",
  headerReplacement: "Ioana & Andrei",
  date: "2026-06-14",
  time: "17:00",
  dateLabel: "14 Iunie 2026",
  parentsLabel: "Părinții noștri",
  parentsNames: "Maria și Cristi Popescu\nIoana și Mihai Ionescu",
  godparentsLabel: "Împreună cu nașii",
  godparentsNames: "Andreea și Vlad Marin",
  civilVenue: "",
  civilAddress: "",
  civilCity: "",
  civilDate: "",
  religiousVenue: "Biserica Sfinții Apostoli Petru și Pavel",
  religiousAddress: "Strada Ion Iuga, 65",
  religiousCity: "Săliștea de Sus",
  religiousDate: "2026-05-09 17:00",
  partyVenue: "Domeniul Manasia",
  partyAddress: "Aleea Eroilor",
  partyCity: "Vișeu de Sus",
  partyDate: "2026-05-09 18:30",
  storyTitle: "Cum totul a început",
  storyText: "Ne-am cunoscut într-o seară de toamnă, în Cișmigiu...",
  youtubeId: "",
  thanksTitle: "Cu drag",
  thanksText: "Vă mulțumim că ne sunteți alături.",
  rsvpDeadline: "2026-05-01",
  askMenu: true,
  askPeople: true,
  theme: "ivory",
  sections: DEFAULT_SECTIONS,
};

/** Stored content may be partial (older invitations); always read it through this. */
export function withDefaults(content: Partial<InvitationContent> | null | undefined): InvitationContent {
  return { ...DEFAULT_CONTENT, ...(content ?? {}) };
}
