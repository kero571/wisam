import { SITE } from "@/data/site";
import { getContent } from "@/lib/content";
import { waLink } from "@/lib/wa";

export async function GET() {
  const c = await getContent();
  const s = c.site;
  const t = `# ${s.name}\n> ${s.description}\n\nSite: ${SITE.url}\nInstagram: ${s.instagramUrl}\nWhatsApp: ${waLink(s.whatsapp, "")}\nService area: Germany & worldwide\n\n## About\n${c.about.quote}\n\n## Packages (EUR, from)\n${[...c.packages.items, c.packages.addon].map((p) => `- ${p.name}: from €${p.price} — ${p.text}`).join("\n")}\n\n## FAQ\n${c.faq.items.map(({ q, a }) => `Q: ${q}\nA: ${a}`).join("\n")}\n`;
  return new Response(t, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
