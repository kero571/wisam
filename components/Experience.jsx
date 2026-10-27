import Icon from "./ui/Icon";
import SecHead from "./ui/SecHead";
import SnapRow from "./SnapRow";
import { EXPERIENCE as e } from "@/data/site";
export default function Experience() {
  return (
    <section id="experience" aria-labelledby="exp-h" className="bg-sand">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-10 lg:py-24">
        <SecHead id="exp-h" label={e.label} title={e.title} />
        <SnapRow
          n={e.items.length}
          dotsClass="lg:hidden"
          className="lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0"
        >
          {e.items.map((i, k) => (
            <li
              key={i.title}
              className="reveal card flex w-[82%] shrink-0 snap-center flex-col p-6 sm:w-[46%] lg:w-auto"
            >
              <span className="mb-5 grid h-11 w-11 place-items-center rounded-xl border border-line text-gold">
                <Icon n={i.icon} />
              </span>
              <h3 className="font-serif text-xl leading-snug">{i.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-7 text-mute">
                {i.text}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[10px] font-semibold tracking-[.2em]">
                <span className="text-gold">{i.tag}</span>
                <span className="text-mute">
                  {String(k + 1).padStart(2, "0")} /{" "}
                  {String(e.items.length).padStart(2, "0")}
                </span>
              </div>
            </li>
          ))}
        </SnapRow>
      </div>
    </section>
  );
}
