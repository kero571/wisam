import Icon from "./ui/Icon";
import SecHead from "./ui/SecHead";
import { waLink } from "@/lib/wa";

const eur = (n) => "€" + Number(n || 0).toLocaleString("en-US");

function Price({ k, from }) {
  return (
    <p className="flex items-baseline gap-1.5 text-right">
      <span className="text-xs text-mute">{from}</span>
      <b className="font-serif text-2xl">{eur(k.price)}</b>
    </p>
  );
}

export default function Packages({ p, whatsapp }) {
  return (
    <section id="packages" aria-labelledby="pk-h" className="mx-auto max-w-6xl px-5 py-16 lg:px-10 lg:py-24">
      <SecHead id="pk-h" label={p.label} title={p.title} sub={p.sub} />
      <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
        {p.items.map((k, i) => (
          <article
            key={`${k.name}-${i}`}
            className={`reveal card relative flex flex-col p-6 lg:p-8 ${
              k.featured ? "!border-gold shadow-[0_24px_50px_-30px_rgba(166,124,82,.8)]" : ""
            }`}
          >
            {k.featured && (
              <span className="absolute -top-3 start-6 rounded-full bg-gold px-3 py-1 text-[10px] font-bold tracking-widest text-white">
                {p.popular}
              </span>
            )}
            <div className="flex items-start justify-between gap-3">
              <span className="label !text-[10px]">{k.tag}</span>
              <Price k={k} from={p.from} />
            </div>
            <h3 className="mt-3 font-serif text-2xl">{k.name}</h3>
            <p className="mt-2 text-sm leading-7 text-mute">{k.text}</p>
            <ul className="my-5 flex-1 space-y-3 text-sm">
              {(k.list || []).map((x, j) => (
                <li key={`${x}-${j}`} className="flex gap-3">
                  <Icon n="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {x}
                </li>
              ))}
            </ul>
            <a
              href={waLink(whatsapp, (p.requestMessage || "").replace("{name}", k.name))}
              rel="noopener"
              className={`btn w-full ${k.featured ? "btn-gold" : "btn-line"}`}
            >
              {p.cta}
            </a>
          </article>
        ))}
      </div>

      {p.addon?.name && (
        <article className="reveal card mt-4 flex flex-col gap-3 p-6 lg:mt-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-8">
          <div>
            <span className="label !text-[10px]">{p.addon.tag}</span>
            <h3 className="mt-2 font-serif text-2xl">{p.addon.name}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-mute">{p.addon.text}</p>
          </div>
          <Price k={p.addon} from={p.from} />
        </article>
      )}

      {p.note?.text && (
        <div className="reveal mt-6 rounded-2xl border border-dashed border-gold/50 p-6 text-center">
          <p className="text-sm">
            {p.note.text}{" "}
            <a href="#inquiry" className="font-semibold text-gold underline-offset-4 hover:underline">
              {p.note.link}
            </a>
          </p>
          <p className="mt-2 text-[10px] font-semibold tracking-[.25em] text-mute">{p.note.small}</p>
        </div>
      )}
    </section>
  );
}
