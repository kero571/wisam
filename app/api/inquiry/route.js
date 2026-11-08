import { NextResponse } from "next/server";

// Public contact-form endpoint: validates, then stores the inquiry in Firestore (collection "inquiries").
// Uses the Firestore REST API, so the visitor never downloads the Firebase SDK.

const hits = new Map(); // best-effort rate limit per IP (resets on cold start)
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) hits.clear();
  return recent.length > 5;
}

const clean = (v, n) => String(v ?? "").trim().slice(0, n);
const s = (v) => ({ stringValue: v });

export async function POST(req) {
  try {
    const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
    if (limited(ip)) return NextResponse.json({ ok: false }, { status: 429 });

    const b = await req.json();
    if (b?.website) return NextResponse.json({ ok: true }); // honeypot: pretend success

    const name = clean(b?.name, 120);
    const email = clean(b?.email, 200);
    if (!name) return NextResponse.json({ ok: false, error: "name" }, { status: 400 });
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "email" }, { status: 400 });
    }

    const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!project || !key) return NextResponse.json({ ok: false, error: "config" }, { status: 500 });

    const fields = {
      name: s(name),
      email: s(email),
      phone: s(clean(b?.phone, 60)),
      date: s(clean(b?.date, 40)),
      venue: s(clean(b?.venue, 200)),
      pkg: s(clean(b?.pkg, 120)),
      msg: s(clean(b?.msg, 2000)),
      social: { booleanValue: !!b?.social },
      read: { booleanValue: false },
      createdAt: { timestampValue: new Date().toISOString() },
    };

    const r = await fetch(
      `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/inquiries?key=${key}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fields }), cache: "no-store" }
    );
    if (!r.ok) return NextResponse.json({ ok: false, error: "store" }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
