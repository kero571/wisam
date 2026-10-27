import MobileMenu from "./MobileMenu";
import Img from "./ui/Img";
import { NAV } from "@/data/site";
export default function Header() {
  return (
    <div className="nav-in sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-[var(--nav)] max-w-6xl items-center justify-between gap-4 px-5 lg:px-10">
        <a href="#top" aria-label="Wisam Abraham — home">
          <Img
            src="/images/logo.png"
            alt="Wisam Abraham Photography Studio"
            width={216}
            height={72}
            priority
            className="h-9 w-auto mix-blend-multiply"
          />
        </a>
        <nav
          aria-label="Main"
          className="hidden items-center gap-9 text-sm font-medium text-mute lg:flex"
        >
          {NAV.slice(0, 4).map(([t, h]) => (
            <a key={h} href={h} className="transition hover:text-gold">
              {t}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#inquiry"
            className="btn btn-line hidden !py-2.5 lg:inline-flex"
          >
            Get in Touch
          </a>
          <MobileMenu links={NAV} />
        </div>
      </div>
    </div>
  );
}
