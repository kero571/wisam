export const SITE = {
  name: "Wisam Abraham",
  url:"https://wisam.vercel.app",
  email: "hello@wisamabraham.com",
  whatsapp: "+4917664484516",
  instagram: {
    handle: "@wisam_abraham",
    url: "https://www.instagram.com/wisam_abraham/",
  },
  title:
    "Wisam Abraham | Wedding Photographer & Videographer in Germany — Worldwide",
  description:
    "Wisam Abraham is a wedding photographer and videographer based in Germany, available worldwide. Authentic, emotional and timeless wedding photography and film. Packages from €1,890.",
  keywords: [
    "wedding photographer Germany",
    "wedding videographer Germany",
    "wedding photography and film",
    "destination wedding photographer",
    "Hochzeitsfotograf",
    "Hochzeitsvideograf",
    "Hochzeitsfilm",
    "Hochzeitsfotograf Bayern",
    "Tegernsee wedding photographer",
    "Italy wedding photographer",
    "documentary wedding photography",
    "cinematic wedding film",
    "Wisam Abraham",
  ],
};
export const wa = (m) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(m)}`;
export const NAV = [
  ["Portfolio", "#portfolio"],
  ["Packages", "#packages"],
  ["About", "#about"],
  ["FAQ", "#faq"],
  ["Contact", "#inquiry"],
];
export const HERO = {
  img: "/images/hero.png",
  alt: "Wedding couple in a romantic hillside setting in Germany",
  eyebrow: "WEDDING PHOTOGRAPHY & FILM · GERMANY",
  title: ["Wedding moments for ", "eternity."],
  text: "Authentic, emotional and timeless. Your wedding day is more than a date, it's an unforgettable chapter of your story.",
  cta1: "View Portfolio",
  cta2: "Get in Touch",
};
export const ABOUT = {
  img: "/images/about.png",
  alt: "Wisam Abraham, wedding photographer and videographer, holding his camera",
  label: "THE ARTIST",
  title: "Meet Wisam",
  quote:
    "“I'm Wisam, a wedding photographer and videographer. As your companion through your special day, I capture both the big emotional highs and the quiet, intimate glances that give you goosebumps for decades.”",
  sign: "Wisam Abraham",
  cta: "Let's Talk",
};
export const STATS = [
  ["6", "YEARS EXPERIENCE"],
  ["58+", "WEDDINGS CAPTURED"],
  ["96h+", "FILM DELIVERED"],
  ["100%", "HAPPY COUPLES"],
];
export const PERKS = [
  ["camera", "Photo & Film in one package"],
  ["globe", "Destination weddings worldwide"],
  ["clock", "Fast, reliable delivery"],
  ["chat", "Personal planning call"],
];
export const PORTFOLIO = {
  label: "PORTFOLIO",
  title: ["Our ", "work", ""],
  tabs: [
    {
      id: "photos",
      name: "PHOTOS",
      folders: [
        {
          id: "yaseen-mona",
          name: "Sara & Omar",
          cover: "/img/sara-omar/cover.jpg",
          photos: ["/img/sara-omar/1.jpg", "/img/sara-omar/2.jpg"],
        },
        {
          id: "mina-sara",
          name: "Sara & Omar",
          cover: "/img/sara-omar/cover.jpg",
          photos: ["/img/sara-omar/1.jpg", "/img/sara-omar/2.jpg"],
        },
        {
          id: "shady-moka",
          name: "Sara & Omar",
          cover: "/img/sara-omar/cover.jpg",
          photos: ["/img/sara-omar/1.jpg", "/img/sara-omar/2.jpg"],
        },
        {
          id: "kero-semo",
          name: "Sara & Omar",
          cover: "/img/sara-omar/cover.jpg",
          photos: ["/img/sara-omar/1.jpg", "/img/sara-omar/2.jpg"],
        },
      ],
    },
    {
      id: "films",
      name: "FILMS",
      more: "https://drive.google.com/drive/folders/XXXX",
      moreLabel: "View more",
      items: [
        { src: "/video/film1.mp4", poster: "/img/film1.jpg" },
        { src: "/video/film2.mp4", poster: "/img/film2.jpg" },
      ],
    },
    {
      id: "reels",
      name: "REELS",
      items: [
        { src: "/video/reel1.mp4", poster: "/img/reel1.jpg" },
        { src: "/video/reel2.mp4", poster: "/img/reel2.jpg" },
      ],
    },
  ],
};
export const EXPERIENCE = {
  label: "THE EXPERIENCE",
  title: ["Why couples choose Wisam"],
  items: [
    {
      icon: "heart",
      tag: "THE APPROACH",
      title: "Natural, unposed moments",
      text: "Honest documentary-style storytelling without awkward poses. You celebrate, I document the quiet poetry.",
    },
    {
      icon: "film",
      tag: "HYBRID CINEMA",
      title: "Photos & film in one person",
      text: "One calm presence instead of two crews: a coherent look and a perfect balance between stills and cinema.",
    },
    {
      icon: "clock",
      tag: "THE DELIVERY",
      title: "Beautiful results, delivered",
      text: "A private online gallery and an emotional film that take you straight back to your wedding day.",
    },
    {
      icon: "globe",
      tag: "THE SERVICE",
      title: "Germany & worldwide",
      text: "Based in Germany and happy to travel — a personal planning call before every wedding.",
    },
  ],
};
export const PACKAGES = {
  label: "INVESTMENT",
  title: ["Choose how your ", "story", " is told."],
  sub: "Transparent investment for lifetime memories.",
  from: "from",
  cta: "Request This Package",
  popular: "MOST POPULAR",
  items: [
    {
      tag: "PURE PHOTOGRAPHY",
      name: "Photo Package",
      price: 1890,
      text: "Authentic documentary-style reportage full of unposed moments and heartfelt celebrations.",
      list: [
        "8 hours coverage on your wedding day",
        "500+ carefully retouched high-res images",
        "Private online gallery & elegant print box",
      ],
    },
    {
      tag: "COMPLETE STORY",
      name: "Photo & Film",
      price: 3490,
      featured: 1,
      text: "Atmospheric photos AND an emotional film that takes you back to your wedding day again and again.",
      list: [
        "10 hours comprehensive coverage",
        "700+ color-graded photographs",
        "Cinematic highlight film + full speeches edit",
        "Drone aerial footage included (weather permitting)",
      ],
    },
    {
      tag: "CINEMATIC MOTION",
      name: "Wedding Film",
      price: 2190,
      text: "Ideal if you already have a photographer and want your day captured in elegant moving images.",
      list: [
        "8 hours cinema coverage",
        "4K highlights film + full ceremony edit",
        "Sound mastering & commercially licensed music",
      ],
    },
  ],
  addon: {
    tag: "INSTANT SOCIALS",
    name: "Social Media Add-on",
    price: 450,
    text: "Short vertical highlight reels and selected mobile-ready images cropped for Instagram, TikTok and WhatsApp, delivered within 24 hours.",
  },
  note: {
    text: "Need something custom?",
    link: "Let's build your bespoke package.",
    small: "LIMITED DATES PER SEASON. SECURE YOUR DATE.",
  },
};
export const TESTIMONIALS = {
  label: "WORDS OF LOVE",
  title: ["Memories cherished ", "forever"],
  items: [
    {
      quote:
        "“Wisam's relaxed and warm manner won us over and delighted our guests too. And we couldn't believe how fast we received the finished video in top quality. A clear recommendation.”",
      name: "Lena & Marc",
      date: "28 JANUARY 2023",
    },
  ],
}; // ← ضيف تقييمات حقيقية هنا
export const FAQ = {
  label: "GOOD TO KNOW",
  title: ["Questions, ", "answered."],
  items: [
    [
      "How far in advance should I book?",
      "Dates are limited per season, so it is best to enquire as soon as you have your wedding date and location.",
    ],
    [
      "Do you travel for destination weddings?",
      "Yes. I am based in Germany and available worldwide — Italy, Bavaria and beyond.",
    ],
    [
      "Can I book only photography or only film?",
      "Yes. Choose the Photo Package, the Wedding Film, or combine both in the Photo & Film package.",
    ],
    [
      "What is the Social Media Add-on?",
      "Short vertical highlight reels and selected mobile-ready images for Instagram, TikTok and WhatsApp, delivered within 24 hours.",
    ],
  ],
};
export const INQUIRY = {
  label: "AVAILABILITY INQUIRY",
  title: ["Let's capture your ", "day."],
  sub: "Tell me about your wedding and I'll get back to you.",
  steps: ["DATE & LOCATION", "PACKAGE CHOICE", "YOUR DETAILS"],
  direct: "PREFER DIRECT CHAT?",
};
export const FOOT = { tag: "WEDDING PHOTOGRAPHY & FILM · GERMANY & WORLDWIDE" };
export const LEGAL = {
  name: "Wisam Abraham",
  street: "[Street and number]",
  city: "[ZIP] [City], Germany",
  vat: "[VAT ID, if applicable]",
};
