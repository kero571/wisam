"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

const KEY = "clarity-consent";

export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_CLARITY_ID;
  const path = usePathname();
  const [ok, setOk] = useState(null); // null = loading, undefined = not asked yet

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      setOk(v === "yes" ? true : v === "no" ? false : undefined);
    } catch {
      setOk(false);
    }
  }, []);

  if (!id || !/^[a-z0-9]{6,20}$/i.test(id) || path?.startsWith("/admin")) return null;

  const choose = (v) => {
    try { localStorage.setItem(KEY, v ? "yes" : "no"); } catch {}
    setOk(v);
  };

  return (
    <>
      {ok === true && (
        <Script id="ms-clarity-init" strategy="afterInteractive">{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(id)});`}</Script>
      )}
      {ok === undefined && (
        <div role="dialog" aria-label="Cookies" className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-line bg-white p-4 text-[13px] leading-relaxed shadow-xl sm:right-auto sm:max-w-sm">
          <p>
            We use Microsoft Clarity (cookies) to understand how visitors use this site.{" "}
            <a href="/datenschutz" className="underline">Privacy</a>
          </p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => choose(true)} className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-white">Accept</button>
            <button type="button" onClick={() => choose(false)} className="rounded-full border border-line px-4 py-2 text-xs font-semibold">Decline</button>
          </div>
        </div>
      )}
    </>
  );
}