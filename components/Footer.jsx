import { waDigits } from "@/lib/wa";

export default function Footer({ site, nav }) {
  const links = [
    ...nav.slice(0, 4),
    ["Instagram", site.instagramUrl],
    ["WhatsApp", "https://wa.me/" + waDigits(site.whatsapp)],
  ];
  return (
    <footer className="bg-dark px-5 pb-24 pt-14 text-center text-white lg:pb-14">
      <p className="font-serif text-2xl tracking-[.35em] lg:text-3xl">{String(site.name).toUpperCase()}</p>
      <p className="mt-3 text-[10px] font-semibold tracking-[.25em] text-gold2">{site.footerTag}</p>
      <nav aria-label="Footer" className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/70">
        {links.map(([t, h]) => (
          <a
            key={t}
            href={h}
            {...(h.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer me" } : {})}
            className="transition hover:text-gold2"
          >
            {t}
          </a>
        ))}
      </nav>
      <p className="mt-8 flex justify-center gap-6 text-[10px] font-semibold tracking-[.25em] text-white/50">
        <a href="/impressum" className="hover:text-gold2">IMPRESSUM</a>
        <a href="/datenschutz" className="hover:text-gold2">DATENSCHUTZ</a>
      </p>
      <p className="mt-3 text-xs text-white/40">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </p>
    </footer>
  );
}
