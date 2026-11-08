import Icon from "./ui/Icon";

export default function Perks({ perks }) {
  if (!perks?.length) return null;
  const row = [...perks, ...perks, ...perks];
  return (
    <section aria-label="Highlights" className="overflow-hidden pb-14 lg:pb-20">
      <ul className="sr-only">
        {perks.map((p, i) => (
          <li key={`${p.text}-${i}`}>{p.text}</li>
        ))}
      </ul>
      <div className="mask-x overflow-hidden" aria-hidden="true">
        <div className="marquee flex w-max gap-3">
          {[...row, ...row].map(({ icon, text }, k) => (
            <span
              key={k}
              className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-white px-5 py-3 text-sm font-medium"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-sand text-gold">
                <Icon n={icon} className="h-4 w-4" />
              </span>
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
