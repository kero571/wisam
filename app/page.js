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
export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Meet />
        <Stats />
        <Perks />
        <Portfolio />
        <Experience />
        <Packages />
        <Testimonials />
        <Faq />
        <Inquiry />
      </main>
      <Footer />
      <ChatFab />
    </>
  );
}
