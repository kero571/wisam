import Img from "./ui/Img";
import Icon from "./ui/Icon";
import { HERO as h } from "@/data/site";
const d = (s) => ({ "--d": s });
export default function Hero() {
  return (
    <header
      id="top"
      className="relative isolate flex min-h-[calc(100svh-var(--nav))] items-end overflow-hidden bg-dark text-white"
    >
      <div className="photo-up absolute inset-0 -z-10">
        <Img
          src={h.img}
          alt={h.alt}
          fill
          priority
          fetchPriority="high"
          quality={75}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#1a120c] via-[#1a120c]/35 to-[#1a120c]/10 lg:via-[#1a120c]/45 lg:to-[#1a120c]/25"
      />
      <div className="mx-auto grid w-full max-w-6xl gap-4 px-5 pb-6 pt-24 text-center lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16 lg:px-10 lg:pb-24 lg:text-start">
        <div>
          <p
            className="fade-u max-lg:absolute max-lg:inset-x-0 max-lg:top-[calc(var(--nav)+1rem)] max-lg:mx-auto max-lg:w-fit max-lg:whitespace-nowrap max-lg:rounded-full max-lg:bg-black/25 max-lg:px-4 max-lg:py-2.5 max-lg:backdrop-blur-sm mb-4 text-[10px] font-semibold uppercase tracking-[.18em] text-gold2 sm:text-[11px] lg:text-[11px] lg:tracking-[.28em]"
            style={d(".6s")}
          >
            {h.eyebrow}
          </p>
          <h1
            className="hero-t from-l font-serif text-[clamp(1.9rem,7vw,2.4rem)] leading-[1.1] lg:text-[clamp(3.6rem,6.4vw,6rem)] lg:leading-[1.08] [&_em]:block lg:[&_em]:inline"
            style={d(".75s")}
          >
            {h.title[0]}
            <em>{h.title[1]}</em>
          </h1>
        </div>
        <div className="from-r" style={d(".95s")}>
          <p className="mx-auto max-w-md text-[15px] leading-6 text-white/80 sm:text-base lg:mx-0 lg:leading-7">
            {h.text}
          </p>
          <div className="mt-5 flex gap-2.5 sm:gap-3 lg:mt-6 lg:flex-wrap">
            <a
              href="#portfolio"
              className="btn btn-gold min-w-0 flex-1 whitespace-nowrap !px-4 !py-3 text-[13px] sm:text-sm lg:flex-none lg:!px-6 lg:!py-3.5"
            >
              <Icon n="camera" className="h-4 w-4 shrink-0" />
              {h.cta1}
            </a>
            <a
              href="#inquiry"
              className="btn min-w-0 flex-1 whitespace-nowrap border border-transparent bg-white/15 !px-4 !py-3 text-[13px] text-white backdrop-blur-md hover:text-gold2 sm:text-sm lg:flex-none lg:!px-6 lg:!py-3.5 lg:border-white/40 lg:bg-transparent lg:backdrop-blur-none lg:hover:border-gold2"
            >
              {h.cta2}
            </a>
          </div>
        </div>
      </div>
      <a
        href="#about"
        aria-label="Scroll down"
        className="fade-u absolute inset-x-0 bottom-5 mx-auto hidden w-fit flex-col items-center gap-1.5 text-[10px] uppercase tracking-[.3em] text-white/70 lg:flex"
        style={d("1.8s")}
      >
        scroll
        <span className="scroll-line h-8 w-px bg-white/60" />
      </a>
    </header>
  );
}