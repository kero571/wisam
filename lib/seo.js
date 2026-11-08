import { SITE } from "@/data/site";
import { DEFAULT_CONTENT } from "@/data/defaults";

export const viewport = { themeColor: "#f6f1e9", width: "device-width", initialScale: 1 };

export function buildMetadata(c) {
  const s = c.site;
  return {
    metadataBase: new URL(SITE.url),
    title: s.title,
    description: s.description,
    keywords: SITE.keywords,
    applicationName: s.name,
    authors: [{ name: s.name }],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      siteName: s.name,
      locale: "en_US",
      title: s.title,
      description: s.description,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: s.name }],
    },
    twitter: { card: "summary_large_image", title: s.title, description: s.description, images: ["/og.jpg"] },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
  };
}

export function buildJsonLd(c) {
  const u = SITE.url;
  const s = c.site;
  const all = [...c.packages.items, c.packages.addon];
  const prices = all.map((p) => Number(p.price) || 0).filter(Boolean);
  const fmt = (n) => "€" + n.toLocaleString("en-US");
  const offers = all.map((p) => ({
    "@type": "Offer",
    name: p.name,
    description: p.text,
    priceCurrency: "EUR",
    priceSpecification: { "@type": "PriceSpecification", minPrice: p.price, priceCurrency: "EUR" },
    seller: { "@id": u + "/#business" },
  }));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": u + "/#person",
        name: s.name,
        jobTitle: "Wedding Photographer & Videographer",
        url: u,
        image: u + "/og.jpg",
        sameAs: [s.instagramUrl],
        knowsAbout: ["Wedding photography", "Wedding film", "Destination weddings"],
      },
      {
        "@type": ["ProfessionalService", "LocalBusiness"],
        "@id": u + "/#business",
        name: s.name + " — Wedding Photography & Film",
        url: u,
        image: u + "/og.jpg",
        description: s.description,
        founder: { "@id": u + "/#person" },
        address: { "@type": "PostalAddress", addressCountry: "DE" },
        areaServed: [{ "@type": "Country", name: "Germany" }, "Worldwide"],
        ...(prices.length ? { priceRange: `${fmt(Math.min(...prices))} – ${fmt(Math.max(...prices))}` } : {}),
        sameAs: [s.instagramUrl],
        hasOfferCatalog: { "@type": "OfferCatalog", name: "Wedding packages", itemListElement: offers },
      },
      {
        "@type": "FAQPage",
        mainEntity: c.faq.items.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      { "@type": "WebSite", "@id": u + "/#site", url: u, name: s.name, inLanguage: "en", publisher: { "@id": u + "/#person" } },
    ],
  };
}

// Static fallbacks (kept for any other file that still imports them).
export const metadata = buildMetadata(DEFAULT_CONTENT);
export const jsonLd = buildJsonLd(DEFAULT_CONTENT);
