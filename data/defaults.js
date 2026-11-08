import {
  SITE, HERO, ABOUT, STATS, PERKS, PORTFOLIO, EXPERIENCE,
  PACKAGES, TESTIMONIALS, FAQ, INQUIRY, FOOT,
} from "./site";

const tab = (id) => PORTFOLIO.tabs.find((t) => t.id === id) || {};
const photos = tab("photos");
const films = tab("films");
const reels = tab("reels");

// Used when nothing is saved yet (or Firestore is unreachable). Built from data/site.js.
export const DEFAULT_CONTENT = {
  site: {
    name: SITE.name,
    logo: "/images/logo.png",
    email: SITE.email,
    whatsapp: SITE.whatsapp,
    instagramHandle: SITE.instagram.handle,
    instagramUrl: SITE.instagram.url,
    title: SITE.title,
    description: SITE.description,
    chatMessage: "Hello Wisam!",
    footerTag: FOOT.tag,
  },
  hero: HERO,
  about: ABOUT,
  stats: STATS.map(([value, label]) => ({ value, label })),
  perks: PERKS.map(([icon, text]) => ({ icon, text })),
  portfolio: {
    label: PORTFOLIO.label,
    title: PORTFOLIO.title,
    photosTab: photos.name || "PHOTOS",
    filmsTab: films.name || "FILMS",
    reelsTab: reels.name || "REELS",
    folders: photos.folders || [],
    films: films.items || [],
    filmsMore: films.more || "",
    filmsMoreLabel: films.moreLabel || "View more",
    reels: reels.items || [],
  },
  experience: EXPERIENCE,
  packages: {
    ...PACKAGES,
    items: PACKAGES.items.map((k) => ({ ...k, featured: !!k.featured })),
    requestMessage: 'Hello Wisam, I\'d like to request the "{name}" package.',
  },
  testimonials: TESTIMONIALS,
  faq: { label: FAQ.label, title: FAQ.title, items: FAQ.items.map(([q, a]) => ({ q, a })) },
  inquiry: {
    label: INQUIRY.label,
    title: INQUIRY.title,
    sub: INQUIRY.sub,
    steps: INQUIRY.steps,
    direct: INQUIRY.direct,
    stepWord: "STEP",
    ofWord: "OF",
    fields: {
      date: { label: "WEDDING DATE", enabled: true, required: true },
      venue: { label: "VENUE / LOCATION", placeholder: "e.g. Tegernsee, Schloss Bensberg…", enabled: true, required: true },
      package: { label: "PACKAGE", enabled: true },
      social: { label: "Add the Social Media Add-on", enabled: true },
      name: { label: "YOUR NAME" },
      email: { label: "EMAIL", enabled: true, required: true },
      phone: { label: "PHONE (OPTIONAL)", enabled: true, required: false },
      message: { label: "MESSAGE (OPTIONAL)", enabled: true, required: false },
    },
    notSure: "Not sure yet",
    nextButtons: ["Next: Package Choice", "Next: Your Details"],
    submit: "Send inquiry",
    sending: "Sending…",
    back: "← Back",
    successTitle: "Thank you, {name}!",
    successText: "Your inquiry has been received. I'll get back to you personally very soon.",
    waAfter: "Also message me on WhatsApp",
    again: "Send another inquiry",
    errorText: "Something went wrong. Please try again, or contact me directly on WhatsApp.",
  },
};
