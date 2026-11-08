export default function Stats({ stats }) {
  if (!stats?.length) return null;
  return (
    <section aria-label="Numbers" className="mx-auto max-w-6xl px-5 py-14 lg:px-10 lg:py-20">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {stats.map(({ value, label }, i) => (
          <li key={`${label}-${i}`} className="reveal card px-4 py-7 text-center">
            <b className="block font-serif text-4xl font-medium lg:text-5xl">{value}</b>
            <span className="mt-2 block text-[10px] font-semibold tracking-[.2em] text-mute">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
