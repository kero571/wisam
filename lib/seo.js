import { SITE, PACKAGES, FAQ, ABOUT } from "@/data/site";
export const metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    locale: "en_US",
    title: SITE.title,
    description: SITE.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};
export const viewport = {
  themeColor: "#f6f1e9",
  width: "device-width",
  initialScale: 1,
};
const u = SITE.url,
  offers = [...PACKAGES.items, PACKAGES.addon].map((p) => ({
    "@type": "Offer",
    name: p.name,
    description: p.text,
    priceCurrency: "EUR",
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: p.price,
      priceCurrency: "EUR",
    },
    seller: { "@id": u + "/#business" },
  }));
export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": u + "/#person",
      name: SITE.name,
      jobTitle: "Wedding Photographer & Videographer",
      url: u,
      image: u + "/og.jpg",
      sameAs: [SITE.instagram.url],
      knowsAbout: [
        "Wedding photography",
        "Wedding film",
        "Destination weddings",
      ],
    },
    {
      "@type": ["ProfessionalService", "LocalBusiness"],
      "@id": u + "/#business",
      name: SITE.name + " — Wedding Photography & Film",
      url: u,
      image: u + "/og.jpg",
      description: SITE.description,
      founder: { "@id": u + "/#person" },
      address: { "@type": "PostalAddress", addressCountry: "DE" },
      areaServed: [{ "@type": "Country", name: "Germany" }, "Worldwide"],
      priceRange: "€450 – €3,490",
      sameAs: [SITE.instagram.url],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Wedding packages",
        itemListElement: offers,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.items.map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      "@type": "WebSite",
      "@id": u + "/#site",
      url: u,
      name: SITE.name,
      inLanguage: "en",
      publisher: { "@id": u + "/#person" },
    },
  ],
};
