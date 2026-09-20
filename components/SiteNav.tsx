"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#yaklasim", label: "Yaklaşımımız" },
  { href: "#surec", label: "Süreç" },
  { href: "#isler", label: "İşler" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("nav", scrolled && "scrolled")}>
      <div className="container-page flex h-20 items-center justify-between">
        <div className="logo-wrap relative">
          <a
            href="#top"
            className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-tight text-[var(--text)]"
          >
            dörtyüzdört
          </a>
          <span className="logo-badge">
            HTTP 404 — sayfa değil, çözüm bulundu.
          </span>
        </div>

        <nav className="nav-links hidden items-center gap-8 sm:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="link text-sm">
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#iletisim" className="btn btn-primary text-sm">
          Görüşelim
        </a>
      </div>
    </header>
  );
}
