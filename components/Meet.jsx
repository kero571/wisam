import Img from "./ui/Img";
import Icon from "./ui/Icon";
import { ABOUT as a, SITE } from "@/data/site";
export default function Meet() {
  return (
    <section id="about" aria-labelledby="about-h" className="bg-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 text-center lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-20 lg:px-10 lg:py-28 lg:text-start">
       <div className="reveal mx-auto w-full max-w-[320px] lg:max-w-[400px]">
  <div className="relative aspect-[4/5] rounded-[40px_40px_20px_20px] bg-white p-[6px] shadow-[0_30px_60px_-34px_rgba(80,50,20,.55)] lg:rounded-[200px_200px_24px_24px]">
    <div className="relative h-full w-full overflow-hidden rounded-[inherit]">
      <Img
        src={a.img}
        alt={a.alt}
        fill
        loading="lazy"
        sizes="(min-width:1024px) 400px,320px"
        className="object-cover object-[50%_20%]"
      />
    </div>
  </div>
</div>
        <div className="reveal">
          <p className="label mb-3">{a.label}</p>
          <h2 id="about-h" className="title">
            {a.title}
          </h2>
          <blockquote className="mx-auto mt-5 max-w-xl text-[15px] leading-8 text-mute lg:mx-0 lg:text-base">
            {a.quote}
          </blockquote>
          <p className="mt-5 font-script text-4xl text-gold">{a.sign}</p>
          <div className="mt-6 flex flex-col items-center gap-4 lg:items-start">
            <a href="#inquiry" className="btn bg-ink text-white hover:bg-gold">
              <Icon n="chat" className="h-4 w-4" />
              {a.cta}
            </a>
            <a
              href={SITE.instagram.url}
              target="_blank"
              rel="noopener noreferrer me"
              className="text-sm text-mute transition hover:text-gold"
            >
              {SITE.instagram.handle} on Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
