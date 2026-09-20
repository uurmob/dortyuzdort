const ITEMS = [
  "WEB TASARIM",
  "AI OTOMASYON",
  "MARKA KİMLİĞİ",
  "NO-CODE ENTEGRASYON",
  "PERFORMANS",
  "SEO",
];

export function ServiceMarquee() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="marquee">
      <div className="marquee-track">
        <div className="marquee-item">
          {doubled.map((item, i) => (
            <span key={i}>
              {item} <span className="dot">·</span>
            </span>
          ))}
        </div>
        <div className="marquee-item" aria-hidden>
          {doubled.map((item, i) => (
            <span key={i}>
              {item} <span className="dot">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
