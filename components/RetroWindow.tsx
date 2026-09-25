"use client";

import { useEffect, useState } from "react";

export function RetroWindow() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    function tick() {
      setTime(
        new Date().toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="window mx-auto mb-8 max-w-xs text-left">
      <div className="window-titlebar">
        <span>dortyuzdort_os.exe</span>
        <span>— 404</span>
      </div>
      <div className="window-body">
        <p>
          <span className="text-[var(--text)]">Durum:</span> kaybolan
          markalar bulunuyor
          <span className="blink-cursor">_</span>
        </p>
        <div className="retro-progress" aria-hidden>
          <div className="retro-progress-fill" />
        </div>
        <p className="mt-2 flex items-center justify-between text-[var(--text-tertiary)]">
          <span>Yerel saat</span>
          <span suppressHydrationWarning>{time ?? "--:--:--"}</span>
        </p>
      </div>
    </div>
  );
}
