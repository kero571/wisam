import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

const API = "https://www.clarity.ms/export-data/api/v1/project-live-insights";
const num = (v) => Number(v) || 0;
const labelOf = (r, dim) =>
  r[dim] ?? r[dim?.toLowerCase()] ?? Object.entries(r).find(([k, v]) => typeof v === "string" && !/count|percent/i.test(k))?.[1] ?? "Unknown";

async function isAdmin(req) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const fbKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const admin = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (!token || !fbKey || !admin) return false;
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${fbKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token }),
  });
  const data = await r.json();
  return r.ok && (data?.users?.[0]?.email || "").toLowerCase() === admin;
}

async function pull(dim) {
  const res = await fetch(`${API}?numOfDays=3&dimension1=${dim}`, {
    headers: { Authorization: `Bearer ${process.env.CLARITY_API_TOKEN}` },
    cache: "no-store", // الكاش بقى على النتيجة كلها تحت، مش على كل طلب
  });
  if (res.status === 429) throw new Error("وصلنا للحد اليومي من Clarity. جرّب بكرة.");
  if (!res.ok) throw new Error(`Clarity رجّع خطأ ${res.status}. اتأكد من CLARITY_API_TOKEN.`);
  const data = await res.json();
  const t = (Array.isArray(data) ? data : []).find((m) => /traffic/i.test(m.metricName)) || data?.[0];
  return (t?.information || []).map((r) => ({
    label: String(labelOf(r, dim)).trim() || "Direct",
    sessions: num(r.totalSessionCount),
    bots: num(r.totalBotSessionCount),
    users: num(r.distinctUserCount ?? r.distantUserCount),
  }));
}

function mergePages(rows) {
  const m = new Map();
  for (const r of rows) {
    let path = r.label;
    try {
      const u = new URL(r.label);
      if (u.hostname === "localhost") continue;
      path = u.pathname || "/";
    } catch {}
    const x = m.get(path) || { label: path, sessions: 0, bots: 0, users: 0 };
    x.sessions += r.sessions; x.bots += r.bots; x.users += r.users;
    m.set(path, x);
  }
  return [...m.values()];
}

const top = (rows, n = 8) => [...rows].sort((a, b) => b.sessions - a.sessions).slice(0, n);
const sum = (rows, k) => rows.reduce((a, r) => a + r[k], 0);

// الـ 4 طلبات بتتعمل مرة واحدة كل 12 ساعة بس، مهما عدد مرات فتح التاب
const loadInsights = unstable_cache(
  async () => {
    const [country, device, source, url] = await Promise.all(["Country", "Device", "Source", "URL"].map(pull));
    const pages = mergePages(url);
    const best = (k) => Math.max(...[country, device, source].map((r) => sum(r, k)));
    const total = best("sessions");
    // a card appears only when its numbers are complete; otherwise Clarity is still processing it
    const complete = (rows, n) => (total > 0 && sum(rows, "sessions") >= total * 0.9 ? top(rows, n) : null);
    return {
      totals: { sessions: total, users: best("users"), bots: best("bots") },
      country: complete(country), device: complete(device), source: complete(source), pages: complete(pages, 6),
    };
  },
  ["clarity-insights"],
  { revalidate: 43200 }
);

export async function GET(req) {
  try {
    if (!(await isAdmin(req))) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    if (!process.env.CLARITY_API_TOKEN) return NextResponse.json({ error: "CLARITY_API_TOKEN غير مضبوط." }, { status: 503 });

    const data = await loadInsights();
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: e.message || "فشل تحميل الأرقام" }, { status: 502 });
  }
}