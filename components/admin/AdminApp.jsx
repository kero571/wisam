"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getCountFromServer, getDoc, query, setDoc, where } from "firebase/firestore";
import { fb } from "@/lib/firebase";
import { DEFAULT_CONTENT } from "@/data/defaults";
import { mergeContent } from "@/lib/merge";
import { TABS } from "./tabs";
import { ghost, inputCls } from "./ui";

function Center({ children }) {
  return <div className="flex min-h-[100svh] items-center justify-center p-5 text-center text-sm">{children}</div>;
}

export default function AdminApp() {
  const [user, setUser] = useState(undefined); // undefined = loading
  const [fatal, setFatal] = useState("");

  useEffect(() => {
    try {
      return onAuthStateChanged(fb().auth, (u) => setUser(u || null));
    } catch {
      setFatal("إعدادات Firebase ناقصة. راجع ملف .env.local وأعد تشغيل المشروع.");
    }
  }, []);

  let body;
  if (fatal) body = <Center>{fatal}</Center>;
  else if (user === undefined) body = <Center>جاري التحميل…</Center>;
  else if (!user) body = <Login />;
  else body = <Dashboard user={user} />;

  return (
    <div dir="rtl" lang="ar" className="min-h-[100svh] bg-cream text-ink">
      {body}
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(fb().auth, email.trim(), pw);
    } catch {
      setErr("الإيميل أو الباسورد غلط");
    }
    setBusy(false);
  }

  return (
    <Center>
      <form onSubmit={submit} className="grid w-full max-w-sm gap-4 rounded-3xl border border-line bg-white p-6 text-start">
        <h1 className="font-serif text-2xl">لوحة التحكم</h1>
        <label className="grid gap-1.5 text-xs font-semibold text-mute">
          الإيميل
          <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} dir="ltr" />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-mute">
          الباسورد
          <input type="password" required autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} className={inputCls} dir="ltr" />
        </label>
        {err && <p className="text-xs text-red-600">{err}</p>}
        <button type="submit" disabled={busy} className="btn btn-gold disabled:opacity-60">
          {busy ? "جاري الدخول…" : "دخول"}
        </button>
      </form>
    </Center>
  );
}

function Dashboard({ user }) {
  const [c, setC] = useState(null);
  const [loadErr, setLoadErr] = useState(false);
  const [tab, setTab] = useState(TABS[0].id);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [unread, setUnread] = useState(0);
  const [status, setStatus] = useState({ type: "", text: "" });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const snap = await getDoc(doc(fb().db, "site", "content"));
        const raw = snap.exists() ? snap.data().json : null;
        if (alive) setC(mergeContent(DEFAULT_CONTENT, raw ? JSON.parse(raw) : {}));
      } catch {
        if (alive) setLoadErr(true);
      }
      try {
        const n = await getCountFromServer(query(collection(fb().db, "inquiries"), where("read", "==", false)));
        if (alive) setUnread(n.data().count);
      } catch {}
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // set(key, value) or set(key, (prev) => next)
  const set = (key, v) => {
    setC((p) => ({ ...p, [key]: typeof v === "function" ? v(p[key]) : v }));
    setDirty(true);
  };

  async function save() {
    setSaving(true);
    setStatus({ type: "", text: "" });
    try {
      await setDoc(doc(fb().db, "site", "content"), { json: JSON.stringify(c), updatedAt: Date.now() });
      let live = false;
      try {
        const idToken = await user.getIdToken();
        const r = await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
        live = r.ok;
      } catch {}
      setDirty(false);
      setStatus(
        live
          ? { type: "ok", text: "تم الحفظ والموقع اتحدّث" }
          : { type: "warn", text: "تم الحفظ، لكن الموقع ممكن ياخد وقت لحد ما يتحدّث (حتى ساعة). اتأكد من ADMIN_EMAIL في إعدادات الاستضافة." }
      );
    } catch (e) {
      setStatus({
        type: "err",
        text:
          e?.code === "permission-denied"
            ? "مفيش صلاحية للحفظ. اتأكد إنك داخل بإيميل الأدمن وإن قواعد Firestore متظبطة."
            : "فشل الحفظ، جرّب تاني.",
      });
    }
    setSaving(false);
  }

  if (loadErr)
    return (
      <Center>
        <div className="grid gap-3">
          <p>تعذر تحميل المحتوى المحفوظ. اتأكد من الإنترنت وقواعد Firestore.</p>
          <button type="button" className={ghost} onClick={() => window.location.reload()}>
            إعادة المحاولة
          </button>
        </div>
      </Center>
    );
  if (!c) return <Center>جاري تحميل المحتوى…</Center>;

  const current = TABS.find((t) => t.id === tab) || TABS[0];
  const Active = current.Comp;
  const color = { ok: "text-green-700", warn: "text-amber-700", err: "text-red-600" }[status.type] || "";

  return (
    <div className="mx-auto w-full max-w-4xl px-5 pt-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl">لوحة التحكم</h1>
          <p className="text-[11px] text-mute" dir="ltr">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className={ghost}>
            عرض الموقع
          </a>
          <button type="button" className={ghost} onClick={() => signOut(fb().auth)}>
            خروج
          </button>
        </div>
      </header>

      <nav aria-label="أقسام الموقع" className="-mx-5 mb-4 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition ${
              t.id === tab ? "border-gold bg-gold text-white" : "border-line bg-white hover:border-gold hover:text-gold"
            }`}
          >
            {t.label}
            {t.id === "messages" && unread > 0 ? ` (${unread})` : ""}
          </button>
        ))}
      </nav>

      <Active c={c} set={set} onUnread={setUnread} />

      {!current.noSave && (
        <div className="sticky bottom-0 z-30 -mx-5 mt-6 border-t border-line bg-cream/95 px-5 py-3 backdrop-blur md:mx-0 md:rounded-t-2xl">
          <div className="flex items-center justify-between gap-3">
            <p className={`text-xs ${color}`} role="status">
              {status.text || (dirty ? "في تعديلات لسه ما اتحفظتش" : "")}
            </p>
            <button type="button" onClick={save} disabled={saving || !dirty} className="btn btn-gold !py-2.5 disabled:opacity-50">
              {saving ? "جاري الحفظ…" : "حفظ ونشر"}
            </button>
          </div>
        </div>
      )}
      <div className="h-6" />
    </div>
  );
}
