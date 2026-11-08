"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "./ui/Icon";

const MAX = 6;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const btn =
  "grid h-10 w-10 place-items-center rounded-full bg-white/10 text-lg text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-gold";

// Full-screen photo viewer: wheel / pinch / double-tap zoom, drag to pan, swipe or arrows to navigate.
export default function Lightbox({ photos, start = 0, label = "", onClose }) {
  const n = photos.length;
  const [i, setI] = useState(start);
  const [view, setView] = useState({ s: 1, x: 0, y: 0 });
  const [anim, setAnim] = useState(true);
  const [ready, setReady] = useState(false);
  const stage = useRef(null);
  const img = useRef(null);
  const closeBtn = useRef(null);
  const viewRef = useRef(view);
  viewRef.current = view;
  const ptrs = useRef(new Map());
  const g = useRef({ moved: 0, dist: 0, scale: 1, sx: 0, sy: 0, lastTap: 0 });

  const bounds = (s) => {
    const st = stage.current;
    const im = img.current;
    if (!st || !im) return { mx: 0, my: 0 };
    return {
      mx: Math.max(0, (im.clientWidth * s - st.clientWidth) / 2),
      my: Math.max(0, (im.clientHeight * s - st.clientHeight) / 2),
    };
  };
  const apply = (s, x, y) => {
    const ns = clamp(s, 1, MAX);
    const { mx, my } = bounds(ns);
    setView({ s: ns, x: ns === 1 ? 0 : clamp(x, -mx, mx), y: ns === 1 ? 0 : clamp(y, -my, my) });
  };
  // zoom keeping the point (cx, cy) — measured from the stage centre — fixed under the finger/cursor
  const zoomAt = (target, cx, cy) => {
    const { s, x, y } = viewRef.current;
    const ns = clamp(target, 1, MAX);
    apply(ns, cx - (cx - x) * (ns / s), cy - (cy - y) * (ns / s));
  };
  const centre = (clientX, clientY) => {
    const r = stage.current.getBoundingClientRect();
    return [clientX - (r.left + r.width / 2), clientY - (r.top + r.height / 2)];
  };
  const go = (d) => {
    if (n < 2) return;
    setReady(false);
    setI((k) => (k + d + n) % n);
  };

  useEffect(() => {
    setView({ s: 1, x: 0, y: 0 });
    if (n > 1) new Image().src = photos[(i + 1) % n]; // warm up the next photo
  }, [i, n, photos]);

  useEffect(() => {
    const prev = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const key = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "+" || e.key === "=") zoomAt(viewRef.current.s * 1.4, 0, 0);
      else if (e.key === "-") zoomAt(viewRef.current.s / 1.4, 0, 0);
      else if (e.key === "0") apply(1, 0, 0);
    };
    const wheel = (e) => {
      e.preventDefault();
      const [cx, cy] = centre(e.clientX, e.clientY);
      zoomAt(viewRef.current.s * Math.exp(-e.deltaY * 0.0015), cx, cy);
    };
    document.addEventListener("keydown", key);
    const el = stage.current;
    el.addEventListener("wheel", wheel, { passive: false });
    return () => {
      document.removeEventListener("keydown", key);
      el.removeEventListener("wheel", wheel);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const down = (e) => {
    stage.current.setPointerCapture?.(e.pointerId);
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setAnim(false);
    const q = g.current;
    q.moved = 0;
    q.sx = e.clientX;
    q.sy = e.clientY;
    if (ptrs.current.size === 2) {
      const [a, b] = [...ptrs.current.values()];
      q.dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      q.scale = viewRef.current.s;
    }
  };
  const move = (e) => {
    const p = ptrs.current.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    p.x = e.clientX;
    p.y = e.clientY;
    g.current.moved += Math.abs(dx) + Math.abs(dy);
    if (ptrs.current.size === 2) {
      const [a, b] = [...ptrs.current.values()];
      const [cx, cy] = centre((a.x + b.x) / 2, (a.y + b.y) / 2);
      zoomAt((g.current.scale * Math.hypot(a.x - b.x, a.y - b.y)) / g.current.dist, cx, cy);
    } else if (viewRef.current.s > 1) {
      const v = viewRef.current;
      apply(v.s, v.x + dx, v.y + dy);
    }
  };
  const up = (e) => {
    if (!ptrs.current.delete(e.pointerId)) return;
    setAnim(true);
    if (ptrs.current.size) return;
    const q = g.current;
    const dx = e.clientX - q.sx;
    const dy = e.clientY - q.sy;
    const tap = q.moved < 8;
    if (viewRef.current.s === 1 && !tap && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      go(dx < 0 ? 1 : -1);
    } else if (tap && e.target === stage.current && viewRef.current.s === 1) {
      onClose();
    } else if (tap && e.target === img.current) {
      const now = Date.now();
      if (now - q.lastTap < 320) {
        const [cx, cy] = centre(e.clientX, e.clientY);
        if (viewRef.current.s > 1) apply(1, 0, 0);
        else zoomAt(2.6, cx, cy);
        q.lastTap = 0;
      } else q.lastTap = now;
    }
  };

  const overlay = (
    <div role="dialog" aria-modal="true" aria-label={label || "Photo viewer"} className="fixed inset-0 z-[60] bg-black/95">
      <div
        ref={stage}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        className="absolute inset-0 flex select-none items-center justify-center overflow-hidden p-3 sm:p-8"
        style={{ touchAction: "none", overscrollBehavior: "contain" }}
      >
        {!ready && <span aria-hidden className="absolute h-10 w-10 animate-spin rounded-full border-[3px] border-white/30 border-t-gold2" />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={img}
          key={photos[i]}
          src={photos[i]}
          alt={label ? `${label} — ${i + 1}` : `Photo ${i + 1}`}
          draggable={false}
          onLoad={() => setReady(true)}
          className="max-h-full max-w-full object-contain"
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`,
            transition: anim ? "transform .18s ease-out, opacity .3s" : "opacity .3s",
            opacity: ready ? 1 : 0,
            cursor: view.s > 1 ? "grab" : "zoom-in",
            willChange: "transform",
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-5">
        <span className="pointer-events-auto rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-widest text-white ring-1 ring-white/20 backdrop-blur">
          {i + 1} / {n}
        </span>
        <button ref={closeBtn} type="button" aria-label="Close" onClick={onClose} className={`pointer-events-auto ${btn}`}>
          <Icon n="close" className="h-5 w-5" />
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 p-4 sm:p-6">
        {n > 1 && (
          <button type="button" aria-label="Previous" onClick={() => go(-1)} className={`pointer-events-auto ${btn}`}>
            <Icon n="arrow" className="h-5 w-5 rotate-180" />
          </button>
        )}
        <button type="button" aria-label="Zoom out" onClick={() => zoomAt(viewRef.current.s / 1.5, 0, 0)} className={`pointer-events-auto ${btn}`}>
          −
        </button>
        <button type="button" aria-label="Reset zoom" onClick={() => apply(1, 0, 0)} className={`pointer-events-auto ${btn} !w-14 text-xs font-semibold`}>
          {Math.round(view.s * 100)}%
        </button>
        <button type="button" aria-label="Zoom in" onClick={() => zoomAt(viewRef.current.s * 1.5, 0, 0)} className={`pointer-events-auto ${btn}`}>
          +
        </button>
        {n > 1 && (
          <button type="button" aria-label="Next" onClick={() => go(1)} className={`pointer-events-auto ${btn}`}>
            <Icon n="arrow" className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );

  // Rendered straight into <body>: a transformed/animated ancestor would otherwise become the
  // containing block of `position: fixed` and clip the viewer to the section (as seen in the bug).
  return createPortal(overlay, document.body);
}
