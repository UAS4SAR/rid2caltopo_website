"use client";

import { useEffect, useRef, useState } from "react";

const alt =
  "RID2Caltopo split view on a tablet. On the left, live video from a drone camera with its callsign, altitude and coordinates overlaid. On the right, a satellite incident map with the drone's red track, magenta search-assignment polygons and the drone marker with altitude, range and heading readouts.";

/** Landscape app screenshot. On narrow screens it keeps a readable height and scrolls sideways. */
export function HeroShot() {
  const scroller = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () => {
      const start = el.scrollLeft <= 4;
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      setEdge((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="hero-shot"
      data-at-start={edge.start}
      data-at-end={edge.end}
    >
      <div
        ref={scroller}
        className="hero-shot-scroller"
        role="region"
        aria-label="RID2Caltopo screenshot: live drone video beside the incident map. Scroll sideways to see the whole image."
        tabIndex={0}
      >
        <div className="hero-shot-track">
          <img
            src="/hero-split-view-1280.webp"
            srcSet="/hero-split-view-800.webp 800w, /hero-split-view-1280.webp 1280w, /hero-split-view-1920.webp 1920w, /hero-split-view-2560.webp 2560w"
            sizes="(max-width: 700px) 641px, (max-width: 1400px) calc(100vw - 48px), 1250px"
            width={2960}
            height={1848}
            fetchPriority="high"
            decoding="async"
            alt={alt}
          />
        </div>
      </div>
      <p className="hero-shot-hint" aria-hidden="true">
        Swipe to see the map <span>→</span>
      </p>
    </div>
  );
}
