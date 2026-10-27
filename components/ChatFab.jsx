"use client";
import { useEffect, useState } from "react";
import Icon from "./ui/Icon";
import { wa } from "@/data/site";

export default function ChatFab() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0.5 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <a
      href={wa("Hello Wisam!")}
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-5 end-5 z-50 grid h-12 w-12 place-items-center rounded-2xl bg-cream text-gold shadow-[0_10px_30px_-8px_rgba(0,0,0,.45)] transition duration-300 hover:-translate-y-1 hover:bg-gold hover:text-white ${
        show ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <Icon n="chat" className="h-5 w-5" />
    </a>
  );
}