"use client";
import { useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const ICONS = ["camera", "film", "heart", "clock", "globe", "chat", "star", "check"];

export const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-mute/60 focus:border-gold";
export const ghost =
  "rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold transition hover:border-gold hover:text-gold disabled:opacity-50";
export const danger =
  "rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:border-red-400 disabled:opacity-50";

/* ---------- path helpers: b("hero.title") => { value, onChange }, l("stats") => { items, onChange } ---------- */
const getIn = (o, path) => (path ? path.split(".").reduce((x, k) => x?.[k], o) : o);
const setIn = (o, parts, v) => {
  if (!parts.length) return v;
  const [h, ...r] = parts;
  const base = Array.isArray(o) ? [...o] : { ...o };
  base[h] = setIn(o?.[h], r, v);
  return base;
};
export function makeBind(c, set) {
  const apply = (path, valOrFn) => {
    const [top, ...rest] = path.split(".");
    set(top, (prev) => {
      const cur = rest.length ? getIn(prev, rest.join(".")) : prev;
      const next = typeof valOrFn === "function" ? valOrFn(cur) : valOrFn;
      return setIn(prev, rest, next);
    });
  };
  return {
    b: (path) => ({ value: getIn(c, path), onChange: (v) => apply(path, v) }),
    l: (path) => ({ items: getIn(c, path), onChange: (v) => apply(path, v) }),
  };
}
export { getIn };

/* ---------- basic building blocks ---------- */
export function Group({ title, children }) {
  return (
    <section className="grid gap-4 rounded-2xl border border-line bg-white p-5">
      <h3 className="font-serif text-lg text-gold">{title}</h3>
      {children}
    </section>
  );
}

export function Field({ label, value, onChange, multiline = false, rows = 3, placeholder }) {
  const common = { value: value ?? "", onChange: (e) => onChange(e.target.value), placeholder, dir: "ltr" };
  return (
    <label className="grid gap-1.5 text-xs font-semibold text-mute">
      {label}
      {multiline ? (
        <textarea rows={rows} {...common} className={`${inputCls} resize-y`} />
      ) : (
        <input type="text" {...common} className={inputCls} />
      )}
    </label>
  );
}

export function NumberField({ label, value, onChange }) {
  return (
    <Field
      label={label}
      value={String(value ?? "")}
      onChange={(v) => onChange(Number(String(v).replace(/[^\d]/g, "")) || 0)}
    />
  );
}

export function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-ink">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#a67c52]"
      />
      {label}
    </label>
  );
}

export function IconSelect({ label, value, onChange, options = ICONS }) {
  return (
    <label className="grid gap-1.5 text-xs font-semibold text-mute">
      {label}
      <span className="flex items-center gap-2">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-sand text-gold">
          <Icon n={value} />
        </span>
        <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} dir="ltr">
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

// Section titles are arrays: [normal, highlighted (gold italic), normal]
export function TitleFields({ parts, value, onChange }) {
  const arr = Array.isArray(value) ? value : [];
  return (
    <>
      {parts.map((label, i) => (
        <Field
          key={i}
          label={label}
          value={arr[i] ?? ""}
          onChange={(v) =>
            onChange((prev) => {
              const n = [...(Array.isArray(prev) ? prev : [])];
              while (n.length < parts.length) n.push("");
              n[i] = v;
              return n;
            })
          }
        />
      ))}
    </>
  );
}

/* ---------- Cloudinary upload button (one or many files) ----------
   onDone(result, file) may be async; the button stays busy until it finishes. */
export function Uploader({ label, accept, multiple = false, onDone, doneText = "تم ✓" }) {
  const ref = useRef(null);
  const [state, setState] = useState(null);
  const [errs, setErrs] = useState([]);
  const [note, setNote] = useState("");

  async function pick(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setErrs([]);
    setNote("");
    const n = files.length;
    const problems = [];
    let done = 0;
    for (let i = 0; i < n; i++) {
      setState({ i: i + 1, n, p: 0 });
      try {
        const res = await uploadToCloudinary(files[i], (p) => setState({ i: i + 1, n, p }));
        setState({ i: i + 1, n, p: 100, post: true });
        await onDone(res, files[i]);
        done++;
      } catch (er) {
        problems.push(er?.message || `${files[i].name}: فشل الرفع`);
        if (!er?.perFile) break; // a general problem (login, network...) would hit every file
      }
    }
    setState(null);
    setErrs(problems);
    if (done) {
      setNote(problems.length ? `تم رفع ${done} من ${n}، والباقي فيه مشكلة:` : doneText);
      setTimeout(() => setNote(""), 6000);
    }
  }

  const text = state
    ? state.post
      ? "جاري تجهيز الملف…"
      : `جاري الرفع ${state.n > 1 ? `(${state.i}/${state.n}) ` : ""}${state.p}%`
    : label;

  return (
    <div className="grid gap-1.5">
      <input ref={ref} type="file" accept={accept} multiple={multiple} onChange={pick} className="hidden" />
      <button type="button" disabled={!!state} onClick={() => ref.current?.click()} className={ghost}>
        {text}
      </button>
      {note && <p className={`text-xs font-semibold ${errs.length ? "text-amber-700" : "text-green-700"}`}>{note}</p>}
      {errs.map((m, k) => (
        <p key={k} className="text-xs text-red-600">
          {m}
        </p>
      ))}
    </div>
  );
}

export function ImageField({ label, value, fallback = "", onChange }) {
  const src = value || fallback;
  return (
    <div className="grid gap-2 text-xs font-semibold text-mute">
      {label}
      <div className="flex items-center gap-3">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-20 w-16 rounded-xl border border-line bg-sand object-cover" />
        ) : (
          <span className="grid h-20 w-16 place-items-center rounded-xl border border-dashed border-line text-center text-[10px]">
            لا توجد صورة
          </span>
        )}
        <div className="grid gap-2">
          <Uploader label="رفع صورة جديدة" accept="image/*" onDone={(r) => onChange(r.url)} />
          {fallback && value !== fallback && (
            <button type="button" onClick={() => onChange(fallback)} className={ghost}>
              الرجوع للصورة الأصلية
            </button>
          )}
          {!fallback && value && (
            <button type="button" onClick={() => onChange("")} className={danger}>
              حذف الصورة
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- list of plain strings ---------- */
export function StringList({ label, items, onChange, addLabel }) {
  const arr = items || [];
  return (
    <div className="grid gap-2 text-xs font-semibold text-mute">
      {label}
      {arr.map((t, i) => (
        <div key={i} className="flex gap-2">
          <input
            dir="ltr"
            value={t}
            onChange={(e) => onChange(arr.map((x, k) => (k === i ? e.target.value : x)))}
            className={inputCls}
          />
          <button type="button" aria-label="حذف" onClick={() => onChange(arr.filter((_, k) => k !== i))} className={danger}>
            ×
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...arr, ""])} className={ghost}>
        + {addLabel}
      </button>
    </div>
  );
}

/* ---------- list of objects (reorder / delete / add) ----------
   onChange accepts an array OR (prev) => array. patch(objOrFn) merges into the item. */
export function ListEditor({ items, onChange, itemLabel, addLabel, newItem, render }) {
  const move = (i, d) =>
    onChange((prev) => {
      const j = i + d;
      if (j < 0 || j >= prev.length) return prev;
      const a = [...prev];
      [a[i], a[j]] = [a[j], a[i]];
      return a;
    });
  const del = (i) => {
    if (window.confirm("متأكد إنك عايز تحذف العنصر ده؟")) onChange((prev) => prev.filter((_, k) => k !== i));
  };
  const patch = (i, o) =>
    onChange((prev) =>
      prev.map((x, k) => (k === i ? { ...x, ...(typeof o === "function" ? o(x) : o) } : x))
    );

  return (
    <div className="grid gap-3">
      {(items || []).map((it, i) => (
        <div key={i} className="rounded-2xl border border-line bg-cream/60 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs font-bold">
              {itemLabel} {i + 1}
            </span>
            <div className="flex gap-1.5">
              <button type="button" aria-label="فوق" onClick={() => move(i, -1)} className={ghost}>
                ▲
              </button>
              <button type="button" aria-label="تحت" onClick={() => move(i, 1)} className={ghost}>
                ▼
              </button>
              <button type="button" onClick={() => del(i)} className={danger}>
                حذف
              </button>
            </div>
          </div>
          {render(it, (o) => patch(i, o), i)}
        </div>
      ))}
      {addLabel && (
        <button type="button" onClick={() => onChange((prev) => [...prev, newItem()])} className={ghost}>
          + {addLabel}
        </button>
      )}
    </div>
  );
}
