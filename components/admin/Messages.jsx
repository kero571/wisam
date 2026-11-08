"use client";
import { useCallback, useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, updateDoc } from "firebase/firestore";
import { fb } from "@/lib/firebase";
import { waDigits } from "@/lib/wa";
import { ghost, danger } from "./ui";

const fmt = (d) =>
  d ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(d) : "";

function Row({ label, children }) {
  if (!children) return null;
  return (
    <div className="grid gap-0.5 sm:grid-cols-[130px_1fr] sm:gap-3">
      <dt className="text-xs font-semibold text-mute">{label}</dt>
      <dd className="text-sm" dir="auto">{children}</dd>
    </div>
  );
}

export default function MessagesTab({ onUnread }) {
  const [items, setItems] = useState(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setErr("");
    setItems(null);
    try {
      const snap = await getDocs(query(collection(fb().db, "inquiries"), orderBy("createdAt", "desc"), limit(200)));
      setItems(
        snap.docs.map((x) => {
          const v = x.data();
          return { id: x.id, ...v, createdAt: v.createdAt?.toDate?.() || null };
        })
      );
    } catch {
      setErr("تعذر تحميل الرسائل. اتأكد من قواعد Firestore وإنك داخل بإيميل الأدمن.");
      setItems([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (items) onUnread?.(items.filter((m) => !m.read).length);
  }, [items, onUnread]);

  async function setRead(m, read) {
    try {
      await updateDoc(doc(fb().db, "inquiries", m.id), { read });
      setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, read } : x)));
    } catch {
      setErr("فشل تحديث الرسالة.");
    }
  }

  async function remove(m) {
    if (!window.confirm(`تحذف رسالة ${m.name}؟ مش هينفع ترجعها.`)) return;
    try {
      await deleteDoc(doc(fb().db, "inquiries", m.id));
      setItems((prev) => prev.filter((x) => x.id !== m.id));
    } catch {
      setErr("فشل الحذف.");
    }
  }

  return (
    <section className="grid gap-4 rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-lg text-gold">رسائل العملاء {items ? `(${items.length})` : ""}</h3>
        <button type="button" onClick={load} className={ghost}>
          تحديث
        </button>
      </div>

      {err && <p className="text-xs text-red-600">{err}</p>}
      {!items && <p className="text-sm text-mute">جاري التحميل…</p>}
      {items && !items.length && !err && <p className="text-sm text-mute">لسه مفيش رسائل.</p>}

      <div className="grid gap-3">
        {(items || []).map((m) => (
          <details
            key={m.id}
            className="rounded-2xl border border-line bg-cream/60 p-4"
            onToggle={(e) => {
              if (e.currentTarget.open && !m.read) setRead(m, true);
            }}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  aria-label={m.read ? "مقروءة" : "جديدة"}
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${m.read ? "bg-line" : "bg-gold"}`}
                />
                <span className={`truncate text-sm ${m.read ? "" : "font-bold"}`} dir="auto">
                  {m.name}
                  {m.pkg ? ` — ${m.pkg}` : ""}
                </span>
              </span>
              <span className="shrink-0 text-[11px] text-mute" dir="ltr">
                {fmt(m.createdAt)}
              </span>
            </summary>

            <dl className="mt-4 grid gap-2.5 border-t border-line pt-4">
              <Row label="الاسم">{m.name}</Row>
              <Row label="تاريخ الفرح">{m.date}</Row>
              <Row label="المكان">{m.venue}</Row>
              <Row label="الباكدج">{m.pkg ? `${m.pkg}${m.social ? " + Social Media Add-on" : ""}` : ""}</Row>
              <Row label="الإيميل">
                {m.email && (
                  <a href={`mailto:${m.email}`} className="text-gold underline-offset-4 hover:underline" dir="ltr">
                    {m.email}
                  </a>
                )}
              </Row>
              <Row label="الهاتف">
                {m.phone && (
                  <a href={`tel:${m.phone}`} className="text-gold underline-offset-4 hover:underline" dir="ltr">
                    {m.phone}
                  </a>
                )}
              </Row>
              <Row label="الرسالة">
                {m.msg && <span className="whitespace-pre-wrap">{m.msg}</span>}
              </Row>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              {m.phone && waDigits(m.phone) && (
                <a href={`https://wa.me/${waDigits(m.phone)}`} target="_blank" rel="noopener noreferrer" className={ghost}>
                  رد على واتساب
                </a>
              )}
              {m.email && (
                <a href={`mailto:${m.email}`} className={ghost}>
                  رد بالإيميل
                </a>
              )}
              <button type="button" onClick={() => setRead(m, !m.read)} className={ghost}>
                {m.read ? "علّمها كجديدة" : "علّمها كمقروءة"}
              </button>
              <button type="button" onClick={() => remove(m)} className={danger}>
                حذف
              </button>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
