"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Img from "./ui/Img";
import Icon from "./ui/Icon";
import VideoCard from "./VideoCard";
import SecHead from "./ui/SecHead";
import { ratioCss, isWide } from "@/lib/ratio";

const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

export default function Portfolio({ p }) {
  const tabs = [
    { id: "photos", name: p.photosTab, has: (p.folders || []).length > 0 },
    { id: "films", name: p.filmsTab, has: (p.films || []).length > 0 },
    { id: "reels", name: p.reelsTab, has: (p.reels || []).length > 0 },
  ].filter((x) => x.has);

  const [t, setT] = useState(tabs[0]?.id);
  const [f, setF] = useState(null); // الفولدر المفتوح في تاب الصور
  const [lb, setLb] = useState(null); // رقم الصورة المفتوحة في العارض

  if (!tabs.length) return null;

  const pick = (id) => {
    setT(id);
    setF(null);
    setLb(null);
  };

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-h"
      className="mx-auto max-w-6xl px-5 py-14 lg:px-10 lg:py-24"
    >
      <SecHead id="portfolio-h" label={p.label} title={p.title} />

      <div role="tablist" aria-label="Portfolio" className="mb-8 flex justify-center gap-2">
        {tabs.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={x.id === t}
            onClick={() => pick(x.id)}
            className={`rounded-full border px-4 py-2.5 text-[11px] font-semibold tracking-widest transition duration-300 ${
              x.id === t
                ? "border-gold bg-gold text-white"
                : "border-line text-mute hover:border-gold hover:text-gold"
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>

      <div key={`${t}-${f?.id || ""}`} role="tabpanel" className="tab-in">
        {/* ===== PHOTOS ===== */}
        {t === "photos" && !f && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 lg:grid-cols-4 lg:gap-x-5">
            {p.folders.map((x) => (
              <button key={x.id} type="button" onClick={() => setF(x)} className="group text-start">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-line bg-sand">
                  {x.cover && (
                    <Img
                      src={x.cover}
                      alt={`${x.name} wedding`}
                      fill
                      loading="lazy"
                      sizes="(min-width:1024px) 25vw,50vw"
                      className="object-cover transition duration-1000 group-hover:scale-105"
                    />
                  )}
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-4 font-serif text-lg leading-tight text-white">
                    {x.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {t === "photos" && f && (
          <>
            <button
              type="button"
              onClick={() => setF(null)}
              className="mb-6 flex items-center gap-2 text-sm font-medium text-mute transition hover:text-gold"
            >
              <Icon n="arrow" className="h-4 w-4 rotate-180" />
              <span className="font-serif text-base">{f.name}</span>
            </button>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
              {(f.photos || []).filter(Boolean).map((src, k) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setLb(k)}
                  aria-label={`${f.name} — open photo ${k + 1}`}
                  className="group relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-sand"
                >
                  <Img
                    src={src}
                    alt={`${f.name} wedding photography`}
                    fill
                    loading="lazy"
                    sizes="(min-width:1024px) 25vw,50vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
            {lb !== null && (
              <Lightbox
                photos={(f.photos || []).filter(Boolean)}
                start={lb}
                label={f.name}
                onClose={() => setLb(null)}
              />
            )}
          </>
        )}

        {/* ===== FILMS (فيديوهات كبيرة) ===== */}
        {t === "films" && (
          <>
            <div className="grid items-start gap-5 md:grid-cols-2">
              {p.films.map((v, k) => (
                <VideoCard
                  key={`${v.src}-${k}`}
                  v={v}
                  ratio={ratioCss(v.ratio, "16:9")}
                  sizes="(min-width:768px) 50vw,100vw"
                />
              ))}
            </div>
            {p.filmsMore && (
              <div className="mt-10 flex justify-center">
                <a
                  href={p.filmsMore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-line w-full max-w-sm"
                >
                  {p.filmsMoreLabel || "View more"}
                  <Icon n="out" className="h-4 w-4" />
                </a>
              </div>
            )}
          </>
        )}

        {/* ===== REELS (عمودي، اتنين جنب بعض) ===== */}
        {t === "reels" && (
          <div className="mx-auto grid max-w-3xl grid-cols-2 items-start gap-3 lg:gap-5">
            {p.reels.map((v, k) => {
              const wide = isWide(v.ratio, "9:16");
              return (
                <div key={`${v.src}-${k}`} className={wide ? "col-span-2" : ""}>
                  <VideoCard
                    v={v}
                    ratio={ratioCss(v.ratio, "9:16")}
                    sizes={wide ? "(min-width:768px) 768px,100vw" : "(min-width:768px) 380px,50vw"}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
