"use client";
import { useState, useRef } from "react";
import Icon from "./ui/Icon";
import { SITE, INQUIRY as q, PACKAGES, wa } from "@/data/site";

const f =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-gold2 [color-scheme:dark]";
const L = "mb-2 block text-[10px] font-semibold tracking-[.22em] text-white/60";
const PK = [...PACKAGES.items.map((p) => p.name), "Not sure yet"];

export default function Inquiry() {
  const [s, setS] = useState(0);
  const [done, setDone] = useState(false);
  const [d, setD] = useState({
    date: "",
    venue: "",
    pkg: PACKAGES.items[1].name,
    social: false,
    name: "",
    email: "",
    phone: "",
    msg: "",
  });
  const form = useRef(null);

  const set = (k) => (e) =>
    setD((x) => ({
      ...x,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const text = () =>
    `Hello Wisam, I'd like to enquire about my wedding.\n\nDate: ${d.date}\nLocation: ${d.venue}\nPackage: ${d.pkg}${d.social ? " + Social Media Add-on" : ""}\n\nName: ${d.name}\nEmail: ${d.email}${d.phone ? `\nPhone: ${d.phone}` : ""}${d.msg ? `\n\n${d.msg}` : ""}`;

  const next = () => form.current.reportValidity() && setS(s + 1);

  const send = (how) => {
    if (!form.current.reportValidity()) return;
    const msg = text();
    if (how === "wa") {
      window.location.href = wa(msg);
    } else {
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
        "Wedding enquiry — " + d.date
      )}&body=${encodeURIComponent(msg)}`;
    }
    setDone(true);
  };

  return (
    <section
      id="inquiry"
      aria-labelledby="inq-h"
      className="dark-sec bg-dark text-white"
    >
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
            <h3 className="font-serif text-2xl">Thank you, {d.name}!</h3>
            <p className="mx-auto mt-3 max-w-sm text-white/65">
              Your inquiry is ready in WhatsApp. Just press send there and
              we'll get back to you soon.
            </p>
            <button
              type="button"
              onClick={() => {
                setDone(false);
                setS(0);
              }}
              className="mt-6 text-sm text-gold2 transition hover:underline"
            >
              Send another inquiry
            </button>
          </div>
        ) : (
          <form
            ref={form}
            onSubmit={(e) => {
              e.preventDefault();
              if (s < 2) next();
              else send("wa");
            }}
            className="reveal rounded-3xl border border-white/10 bg-white/[.04] p-5 sm:p-8"
          >
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between text-[10px] font-semibold tracking-[.2em]">
                <span className="text-gold2">STEP {s + 1} OF 3</span>
                <span className="text-white/60">{q.steps[s]}</span>
              </div>
              <div className="h-0.5 w-full overflow-hidden rounded bg-white/10">
                <div
                  className="h-full rounded bg-gold2 transition-[width] duration-500 ease-out"
                  style={{ width: `${((s + 1) / 3) * 100}%` }}
                />
              </div>
            </div>

            <div key={s} className="step-in grid gap-5">
              {s === 0 && (
                <>
                  <label>
                    <span className={L}>WEDDING DATE</span>
                    <input
                      required
                      type="date"
                      value={d.date}
                      onChange={set("date")}
                      className={f}
                    />
                  </label>
                  <label>
                    <span className={L}>VENUE / LOCATION</span>
                    <input
                      required
                      type="text"
                      value={d.venue}
                      onChange={set("venue")}
                      placeholder="e.g. Tegernsee, Schloss Bensberg…"
                      className={f}
                    />
                  </label>
                </>
              )}

              {s === 1 && (
                <fieldset className="grid gap-3">
                  <legend className={L}>PACKAGE</legend>
                  {PK.map((n) => (
                    <label
                      key={n}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-sm transition ${
                        d.pkg === n
                          ? "border-gold2 bg-gold2/10"
                          : "border-white/15 hover:border-white/40"
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
                  <label className="mt-1 flex cursor-pointer items-center gap-3 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={d.social}
                      onChange={set("social")}
                      className="h-4 w-4 accent-[#d1ad7e]"
                    />
                    Add the Social Media Add-on
                  </label>
                </fieldset>
              )}

              {s === 2 && (
                <>
                  <label>
                    <span className={L}>YOUR NAME</span>
                    <input
                      required
                      autoComplete="name"
                      value={d.name}
                      onChange={set("name")}
                      className={f}
                    />
                  </label>
                  <label>
                    <span className={L}>EMAIL</span>
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      value={d.email}
                      onChange={set("email")}
                      className={f}
                    />
                  </label>
                  <label>
                    <span className={L}>PHONE (OPTIONAL)</span>
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={d.phone}
                      onChange={set("phone")}
                      className={f}
                    />
                  </label>
                  <label>
                    <span className={L}>MESSAGE (OPTIONAL)</span>
                    <textarea
                      rows={3}
                      value={d.msg}
                      onChange={set("msg")}
                      className={f}
                    />
                  </label>
                </>
              )}
            </div>

            <div className="mt-7 flex flex-col gap-3">
              {s < 2 ? (
                <button
                  type="button"
                  onClick={next}
                  className="btn btn-gold w-full !py-4"
                >
                  {s === 0 ? "Next: Package Choice" : "Next: Your Details"}
                  <Icon n="arrow" className="h-4 w-4" />
                </button>
              ) : (
                <>
                  <button type="submit" className="btn btn-gold w-full !py-4">
                    <Icon n="whatsapp" className="h-5 w-5" />
                    Send inquiry via WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => send("mail")}
                    className="btn w-full border border-white/25 text-white hover:border-gold2 hover:text-gold2"
                  >
                    <Icon n="mail" className="h-4 w-4" />
                    Or send by email
                  </button>
                </>
              )}
              {s > 0 && (
                <button
                  type="button"
                  onClick={() => setS(s - 1)}
                  className="text-sm text-white/60 transition hover:text-white"
                >
                  ← Back
                </button>
              )}
            </div>
          </form>
        )}

        <div className="reveal mt-10 text-center">
          <p className="mb-4 text-[10px] font-semibold tracking-[.25em] text-white/50">
            {q.direct}
          </p>
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm">
            <li>
              <a
                href={wa("Hello Wisam!")}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 transition hover:text-gold2"
              >
                <Icon n="whatsapp" className="h-4 w-4" />
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-2 transition hover:text-gold2"
              >
                <Icon n="mail" className="h-4 w-4" />
                Email
              </a>
            </li>
            <li>
              <a
                href={SITE.instagram.url}
                target="_blank"
                rel="noopener noreferrer me"
                className="inline-flex items-center gap-2 transition hover:text-gold2"
              >
                <Icon n="instagram" className="h-4 w-4" />
                {SITE.instagram.handle}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}