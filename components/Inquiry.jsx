"use client";
import { useState, useRef } from "react";
import Icon from "./ui/Icon";
import { waLink } from "@/lib/wa";

const fcls =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-gold2 [color-scheme:dark]";
const L = "mb-2 block text-[10px] font-semibold tracking-[.22em] text-white/60";

// Which fields live in which step (a field is hidden when disabled in the dashboard).
const STEP_FIELDS = [
  ["date", "venue"],
  ["package", "social"],
  ["name", "email", "phone", "message"],
];

export default function Inquiry({ q, packages, site }) {
  const F = q.fields;
  const steps = STEP_FIELDS.map((keys, i) => ({
    i,
    keys: keys.filter((k) => k === "name" || F[k]?.enabled),
  })).filter((x) => x.keys.length);
  const total = steps.length;
  const options = [...packages.map((p) => p.name), ...(q.notSure ? [q.notSure] : [])];

  const [s, setS] = useState(0);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const [hp, setHp] = useState(""); // honeypot (bots fill it, people never see it)
  const [d, setD] = useState({
    date: "",
    venue: "",
    pkg: (packages[1] || packages[0] || {}).name || "",
    social: false,
    name: "",
    email: "",
    phone: "",
    msg: "",
  });
  const form = useRef(null);

  const set = (k) => (e) =>
    setD((x) => ({ ...x, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const cur = steps[s];
  const last = s === total - 1;

  const waText = () =>
    `Hello ${String(site.name).split(" ")[0]}, I just sent an enquiry through your website.\n\nName: ${d.name}${
      d.date ? `\nDate: ${d.date}` : ""
    }${d.venue ? `\nLocation: ${d.venue}` : ""}${d.pkg ? `\nPackage: ${d.pkg}${d.social ? " + Social Media Add-on" : ""}` : ""}`;

  const next = () => form.current.reportValidity() && setS(s + 1);

  async function submit() {
    if (!form.current.reportValidity()) return;
    setSending(true);
    setErr("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...d, website: hp }),
      });
      if (!res.ok) throw new Error("fail");
      setDone(true);
    } catch {
      setErr(q.errorText);
    }
    setSending(false);
  }

  const field = (k) => {
    const c = F[k] || {};
    switch (k) {
      case "date":
        return (
          <label key={k}>
            <span className={L}>{c.label}</span>
            <input required={!!c.required} type="date" value={d.date} onChange={set("date")} className={fcls} />
          </label>
        );
      case "venue":
        return (
          <label key={k}>
            <span className={L}>{c.label}</span>
            <input
              required={!!c.required}
              type="text"
              value={d.venue}
              onChange={set("venue")}
              placeholder={c.placeholder}
              className={fcls}
            />
          </label>
        );
      case "package":
        return (
          <fieldset key={k} className="grid gap-3">
            <legend className={L}>{c.label}</legend>
            {options.map((n) => (
              <label
                key={n}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-sm transition ${
                  d.pkg === n ? "border-gold2 bg-gold2/10" : "border-white/15 hover:border-white/40"
                }`}
              >
                <input
                  type="radio"
                  name="pkg"
                  value={n}
                  checked={d.pkg === n}
                  onChange={set("pkg")}
                  className="accent-[#d1ad7e]"
                />
                {n}
              </label>
            ))}
          </fieldset>
        );
      case "social":
        return (
          <label key={k} className="flex cursor-pointer items-center gap-3 text-sm text-white/80">
            <input
              type="checkbox"
              checked={d.social}
              onChange={set("social")}
              className="h-4 w-4 accent-[#d1ad7e]"
            />
            {c.label}
          </label>
        );
      case "name":
        return (
          <label key={k}>
            <span className={L}>{c.label}</span>
            <input required autoComplete="name" value={d.name} onChange={set("name")} className={fcls} />
          </label>
        );
      case "email":
        return (
          <label key={k}>
            <span className={L}>{c.label}</span>
            <input
              required={!!c.required}
              type="email"
              autoComplete="email"
              value={d.email}
              onChange={set("email")}
              className={fcls}
            />
          </label>
        );
      case "phone":
        return (
          <label key={k}>
            <span className={L}>{c.label}</span>
            <input
              required={!!c.required}
              type="tel"
              autoComplete="tel"
              value={d.phone}
              onChange={set("phone")}
              className={fcls}
            />
          </label>
        );
      case "message":
        return (
          <label key={k}>
            <span className={L}>{c.label}</span>
            <textarea
              required={!!c.required}
              rows={3}
              value={d.msg}
              onChange={set("msg")}
              className={fcls}
            />
          </label>
        );
      default:
        return null;
    }
  };

  return (
    <section id="inquiry" aria-labelledby="inq-h" className="dark-sec bg-dark text-white">
      <div className="mx-auto max-w-2xl px-5 py-16 lg:py-24">
        <div className="reveal mb-9 text-center">
          <p className="label !text-gold2 mb-3">{q.label}</p>
          <h2 id="inq-h" className="title">
            {q.title[0]}
            <em>{q.title[1]}</em>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/65">{q.sub}</p>
        </div>

        {done ? (
          <div className="reveal rounded-3xl border border-white/10 bg-white/[.04] p-8 text-center">
            <h3 className="font-serif text-2xl">{(q.successTitle || "").replace("{name}", d.name)}</h3>
            <p className="mx-auto mt-3 max-w-sm text-white/65">{q.successText}</p>
            {q.waAfter && (
              <a
                href={waLink(site.whatsapp, waText())}
                target="_blank"
                rel="noopener"
                className="btn btn-gold mt-6"
              >
                <Icon n="whatsapp" className="h-5 w-5" />
                {q.waAfter}
              </a>
            )}
            <div>
              <button
                type="button"
                onClick={() => {
                  setDone(false);
                  setS(0);
                }}
                className="mt-5 text-sm text-gold2 transition hover:underline"
              >
                {q.again}
              </button>
            </div>
          </div>
        ) : (
          <form
            ref={form}
            onSubmit={(e) => {
              e.preventDefault();
              if (last) submit();
              else next();
            }}
            className="reveal relative rounded-3xl border border-white/10 bg-white/[.04] p-5 sm:p-8"
          >
            <input
              type="text"
              name="website"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between text-[10px] font-semibold tracking-[.2em]">
                <span className="text-gold2">
                  {q.stepWord} {s + 1} {q.ofWord} {total}
                </span>
                <span className="text-white/60">{q.steps[cur.i]}</span>
              </div>
              <div className="h-0.5 w-full overflow-hidden rounded bg-white/10">
                <div
                  className="h-full rounded bg-gold2 transition-[width] duration-500 ease-out"
                  style={{ width: `${((s + 1) / total) * 100}%` }}
                />
              </div>
            </div>

            <div key={s} className="step-in grid gap-5">
              {cur.keys.map(field)}
            </div>

            {err && (
              <p role="alert" className="mt-5 text-sm text-red-300">
                {err}
              </p>
            )}

            <div className="mt-7 flex flex-col gap-3">
              {last ? (
                <button type="submit" disabled={sending} className="btn btn-gold w-full !py-4 disabled:opacity-60">
                  <Icon n="arrow" className="h-4 w-4" />
                  {sending ? q.sending : q.submit}
                </button>
              ) : (
                <button type="button" onClick={next} className="btn btn-gold w-full !py-4">
                  {(q.nextButtons || [])[steps[s + 1].i - 1] || "Next"}
                  <Icon n="arrow" className="h-4 w-4" />
                </button>
              )}
              {s > 0 && (
                <button
                  type="button"
                  onClick={() => setS(s - 1)}
                  className="text-sm text-white/60 transition hover:text-white"
                >
                  {q.back}
                </button>
              )}
            </div>
          </form>
        )}

        <div className="reveal mt-10 text-center">
          <p className="mb-4 text-[10px] font-semibold tracking-[.25em] text-white/50">{q.direct}</p>
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm">
            <li>
              <a
                href={waLink(site.whatsapp, site.chatMessage)}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 transition hover:text-gold2"
              >
                <Icon n="whatsapp" className="h-4 w-4" />
                WhatsApp
              </a>
            </li>
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 transition hover:text-gold2">
                  <Icon n="mail" className="h-4 w-4" />
                  Email
                </a>
              </li>
            )}
            <li>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer me"
                className="inline-flex items-center gap-2 transition hover:text-gold2"
              >
                <Icon n="instagram" className="h-4 w-4" />
                {site.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
