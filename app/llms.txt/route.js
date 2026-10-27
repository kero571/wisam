import {SITE,PACKAGES,FAQ,ABOUT,wa} from '@/data/site';
export function GET(){const t=`# ${SITE.name}\n> ${SITE.description}\n\nSite: ${SITE.url}\nInstagram: ${SITE.instagram.url}\nWhatsApp: ${wa('')}\nService area: Germany & worldwide\n\n## About\n${ABOUT.quote}\n\n## Packages (EUR, from)\n${[...PACKAGES.items,PACKAGES.addon].map(p=>`- ${p.name}: from €${p.price} — ${p.text}`).join('\n')}\n\n## FAQ\n${FAQ.items.map(([q,a])=>`Q: ${q}\nA: ${a}`).join('\n')}\n`;
return new Response(t,{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=3600'}})}
