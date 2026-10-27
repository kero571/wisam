import {SITE} from '@/data/site';
const r={allow:'/'};
export default function robots(){return{rules:[{userAgent:'*',...r},{userAgent:['GPTBot','OAI-SearchBot','ChatGPT-User','ClaudeBot','Claude-SearchBot','PerplexityBot','Google-Extended','Applebot-Extended'],...r}],sitemap:SITE.url+'/sitemap.xml',host:SITE.url}}
