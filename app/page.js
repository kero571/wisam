import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Meet from "@/components/Meet";
import Stats from "@/components/Stats";
import Perks from "@/components/Perks";
import Portfolio from "@/components/Portfolio";
import Experience from "@/components/Experience";
import Packages from "@/components/Packages";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Inquiry from "@/components/Inquiry";
import Footer from "@/components/Footer";
import ChatFab from "@/components/ChatFab";
import { NAV } from "@/data/site";
import { getContent } from "@/lib/content";

export default async function Page() {
  const c = await getContent();
  return (
    <>
      <Header site={c.site} nav={NAV} />
      <main>
        <Hero hero={c.hero} />
        <Meet about={c.about} site={c.site} />
        <Stats stats={c.stats} />
        <Perks perks={c.perks} />
        <Portfolio p={c.portfolio} />
        <Experience e={c.experience} />
        <Packages p={c.packages} whatsapp={c.site.whatsapp} />
        <Testimonials t={c.testimonials} />
        <Faq f={c.faq} />
        <Inquiry q={c.inquiry} packages={c.packages.items} site={c.site} />
      </main>
      <Footer site={c.site} nav={NAV} />
      <ChatFab whatsapp={c.site.whatsapp} message={c.site.chatMessage} />
    </>
  );
}
