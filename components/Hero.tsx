"use client";

import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero({
  eyebrow,
  titleMain,
  titleSecondary,
  paragraph,
  pillars,
}: {
  eyebrow: string;
  titleMain: string;
  titleSecondary: string;
  paragraph: string;
  pillars: string[];
}) {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    const el = spotlightRef.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    });
  }

  return (
    <section
      id="top"
      onPointerMove={handlePointerMove}
      className="relative overflow-hidden pt-40 pb-24 lg:pt-52 lg:pb-32"
    >
      <div
        className="orb -left-32 -top-20 h-80 w-80 bg-[var(--accent)] blur-[90px]"
        aria-hidden
      />
      <div
        className="orb -right-24 top-40 h-96 w-96 bg-[var(--accent-2)] blur-[100px]"
        aria-hidden
      />
      <div ref={spotlightRef} className="hero-spotlight" aria-hidden />

      <div className="container-page relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow justify-center">{eyebrow}</span>

          <h1 className="mt-6 text-[clamp(2.75rem,6vw,5rem)] leading-[1.05] font-bold">
            <span className="gradient-text">{titleMain}</span>
            <br />
            {titleSecondary}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--text-secondary)]">
            {paragraph}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#iletisim" className="btn btn-primary">
              Projeni Anlat <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#hizmetler" className="btn btn-ghost">
              Hizmetlere Göz At
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {pillars.map((pillar) => (
              <span key={pillar} className="tag">
                <Sparkles className="h-3.5 w-3.5" />
                {pillar}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
