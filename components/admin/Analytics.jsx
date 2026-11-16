"use client";
import { useEffect, useState } from "react";
import { fb } from "@/lib/firebase";

const ID = process.env.NEXT_PUBLIC_CLARITY_ID;
const base = ID ? `https://clarity.microsoft.com/projects/view/${ID}` : "";
const LINKS = [
  ["Dashboard", "كل الأرقام والفلاتر والتواريخ", "dashboard"],
  ["Heatmaps", "الزوار بيضغطوا فين وبينزلوا لحد فين", "heatmaps"],
  ["Recordings", "شاهد جلسات الزوار الحقيقية", "impressions"],
  ["Settings", "إضافة أعضاء وحجب IP وإعدادات الكوكيز", "settings"],
];

function List({ title, rows }) {
  const max = Math.max(1, ...rows.map((r) => r.sessions));
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <h3 className="mb-3 text-sm font-bold">{title}</h3>
      <ul className="grid gap-2.5">
        {rows.map((r) => (
          <li key={r.label} className="text-xs">
            <div className="flex justify-between gap-3">
              <span className="truncate" dir="auto">{r.label}</span>
              <span className="tabular-nums text-mute">{r.sessions}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sand">
              <div className="h-full rounded-full bg-gold" style={{ width: `${(r.sessions / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AnalyticsTab() {
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = await fb().auth.currentUser.getIdToken();
        const r = await fetch("/api/analytics", { headers: { Authorization: `Bearer ${token}` } });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "فشل التحميل");
        setD(j);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, []);

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="font-serif text-xl">الزوار — آخر 3 أيام</h2>
        <p className="mt-1 text-xs text-mute">
          الأرقام بتتحدّث مرتين في اليوم (حد Microsoft Clarity)، وبتشمل بس الزوار اللي وافقوا على الكوكيز. للتواريخ الأقدم والـ Heatmaps والتسجيلات استخدم الأزرار تحت.
        </p>
      </div>

      {err && <div className="rounded-2xl border border-line bg-white p-5 text-xs text-red-600">{err}</div>}
      {!d && !err && <p className="text-xs text-mute">جاري التحميل…</p>}

      {d &&
        (d.totals.sessions === 0 ? (
          <div className="rounded-2xl border border-line bg-white p-5 text-xs text-mute">
            لسه مفيش زيارات متسجلة. الأرقام بتظهر هنا تلقائياً لما Clarity يخلص معالجة أول الزيارات.
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              {[["الزيارات (Sessions)", d.totals.sessions], ["زوار فريدين", d.totals.users], ["زيارات بوتات (مستبعدة)", d.totals.bots]].map(([t, v]) => (
                <div key={t} className="rounded-2xl border border-line bg-white p-5">
                  <p className="text-xs text-mute">{t}</p>
                  <p className="mt-1 text-3xl font-bold tabular-nums" dir="ltr">{v}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {d.country && <List title="الدول" rows={d.country} />}
              {d.device && <List title="الأجهزة" rows={d.device} />}
              {d.source && <List title="مصادر الزيارات" rows={d.source} />}
              {d.pages && <List title="أكتر الصفحات زيارة" rows={d.pages} />}
            </div>
            {[d.country, d.device, d.source, d.pages].some((x) => !x) && (
              <p className="text-[11px] text-mute">بعض التفاصيل لسه بتتعالج في Clarity وهتظهر هنا تلقائياً. تقدر تشوفها دلوقتي من الأزرار تحت.</p>
            )}
          </>
        ))}

      <div>
        <h3 className="mb-3 text-sm font-bold">افتح في Microsoft Clarity</h3>
        {!ID ? (
          <p className="text-xs text-mute">ضيف NEXT_PUBLIC_CLARITY_ID في إعدادات الاستضافة.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {LINKS.map(([t, desc, p]) => (
              <a key={p} href={`${base}/${p}`} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-line bg-white p-5 transition hover:border-gold">
                <p className="font-bold" dir="ltr">{t} ↗</p>
                <p className="mt-1 text-xs text-mute">{desc}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}