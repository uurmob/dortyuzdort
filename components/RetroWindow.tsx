"use client";

import { useEffect, useState } from "react";

const BOOT_LINES = [
  "> Marka analiz ediliyor...",
  "> Tasarım sistemi yükleniyor...",
  "> Otomasyon akışı bağlanıyor...",
  "> Optimizasyon: 3/3 tamamlandı",
  "> Durum: BULUNABİLİR",
];

export function RetroWindow() {
  const [time, setTime] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    function updateClock() {
      setTime(
        new Date().toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }
    updateClock();
    const clockId = setInterval(updateClock, 1000);
    const tickId = setInterval(() => setTick((t) => t + 1), 1000);
    return () => {
      clearInterval(clockId);
      clearInterval(tickId);
    };
  }, []);

  useEffect(() => {
    if (lineCount >= BOOT_LINES.length) return;
    const id = setTimeout(() => setLineCount((c) => c + 1), 550);
    return () => clearTimeout(id);
  }, [lineCount]);

  const done = lineCount >= BOOT_LINES.length;

  return (
    <div className="window mx-auto mb-8 max-w-xs text-left">
      <div className="window-titlebar">
        <span className="window-titlebar-dots" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="window-titlebar-name">dortyuzdort_os.exe</span>
        <span>— 404</span>
      </div>
      <div className="window-body">
        {BOOT_LINES.slice(0, lineCount).map((line, i) => (
          <p key={i}>
            {line}
            {done && i === BOOT_LINES.length - 1 && (
              <span className="blink-cursor">_</span>
            )}
          </p>
        ))}
        <div className="window-footer">
          <span suppressHydrationWarning>
            TICK:{String(tick).padStart(4, "0")}
          </span>
          <span suppressHydrationWarning>{time ?? "--:--:--"}</span>
        </div>
      </div>
    </div>
  );
}
