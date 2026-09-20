# DESIGN.md

> Karanlıkta net bir sinyal: sakin bir zeminin üzerinde parlayan, güvenilir ama teknik bir ajans kimliği.

## 1. Visual Theme & Atmosphere

**Style**: Dark Tech (koyu, camsı, hafif glow)
**Keywords**: koyu, teknik, net, güvenilir, camsı, minimal-parlak, modern, sakin-enerjik
**Tone**: Kendinden emin ve teknik ama soğuk değil — NOT kurumsal-sıkıcı, NOT aşırı neon/cyberpunk, NOT oyuncak/emoji ağırlıklı
**Feel**: Karanlık bir stüdyoda tek bir spot ışığın aydınlattığı, düzenli ve iyi kurgulanmış bir sunum masası.

**Interaction Tier**: L2 — Akıcı Etkileşim (scroll reveal, stagger, hover glow, nav blur, hafif parallax)
**Dependencies**: CSS + IntersectionObserver (vanilla) + framer-motion (mevcut React kart/hover mikro-etkileşimleri için). GSAP/Lenis/WebGL yok.

## 2. Color Palette & Roles

```css
:root {
  /* Backgrounds */
  --bg: #0b0b0f; /* Sayfa zemini */
  --surface: #131318; /* Kart/panel zemini */
  --surface-alt: #0f0f14; /* Alternatif section zemini */
  --surface-hover: #1b1b22; /* Hover durumunda yüzey */

  /* Borders */
  --border: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.18);

  /* Text */
  --text: #f3f4f6; /* Başlıklar, önemli metin */
  --text-secondary: #9ca3af; /* Gövde metni, açıklamalar */
  --text-tertiary: #6b7280; /* Etiketler, yardımcı bilgi */

  /* Accent */
  --accent: #00d4ff; /* Ana vurgu: CTA, linkler, aktif durum */
  --accent-hover: #33deff;
  --accent-2: #8b5cf6; /* İkincil vurgu: yalnızca gradientlerde destek */

  /* RGB variants for rgba() */
  --bg-rgb: 11, 11, 15;
  --accent-rgb: 0, 212, 255;
  --accent-2-rgb: 139, 92, 246;

  /* Semantic */
  --success: #22c55e;
  --error: #ef4444;
  --warning: #f59e0b;
}
```

**Color Rules:**
- Tüm renkler CSS custom property üzerinden kullanılır; component içine hardcoded hex gömülmez.
- Bir section içinde en fazla bir baskın vurgu rengi (`--accent`) olur; `--accent-2` yalnızca gradient geçişlerinde destekleyici olarak görünür.
- `--text-secondary` gövde metni için zorunludur; saf beyaz (`#fff`) gövde metninde kullanılmaz (kontrast çok sert kaçar).

## 3. Typography Rules

**Font Stack:** Next.js `next/font/google` ile self-hosted olarak yüklenir (harici `@import` isteği yok):
- Heading: Space Grotesk (`next/font/google`, weights 500/700)
- Body: Inter (`next/font/google`, weights 400/500/600)
- Mono (etiket/easter-egg detayları): JetBrains Mono (`next/font/google`, weight 400/500)

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Hero H1 | Space Grotesk | clamp(2.75rem, 6vw, 5rem) | 700 | 1.05 | -0.02em |
| Section H2 | Space Grotesk | clamp(2rem, 4vw, 2.75rem) | 700 | 1.15 | -0.01em |
| H3 | Space Grotesk | 1.25rem | 600 | 1.3 | — |
| Body | Inter | 1.0625rem | 400 | 1.7 | 0 |
| Label / Eyebrow | Inter | 0.8125rem | 600 | 1.4 | 0.14em (uppercase) |
| Mono / Detail | JetBrains Mono | 0.8125rem | 500 | 1.5 | 0 |

**Typography Rules:**
- Başlıklarda ağırlık ≥ 600; gövde metninde 400-500 dışına çıkılmaz.
- Türkçe karakterler (ş, ğ, ı, İ, ç, ö, ü) tüm seçilen fontlarda (Space Grotesk, Inter, JetBrains Mono) native destekleniyor.
- **NEVER use**: sistem serif fontları, Comic Sans/el yazısı fontlar, tüm başlıklarda italik.

**Text Decoration:**
- Hero H1: gradient text (`--text` → `--accent`) + subtle glow (`text-shadow: 0 0 40px rgba(var(--accent-rgb), 0.35)`) — koyu zemin + büyük punto koşulu sağlanıyor.
- Section H2: düz `--text` rengi, gradient/glow **yok** (aşırı kullanım engellenir, sadece Hero'da özel).
- Eyebrow etiketler: `letter-spacing` + `--accent` rengiyle küçük bir sol çizgi/nokta işareti, text-shadow yok.
- Gövde paragrafında (`p`) hiçbir dekorasyon uygulanmaz.

## 4. Component Stylings

### Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9375rem;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #05070a;
  border: 1px solid transparent;
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(var(--accent-rgb), 0.35);
}
.btn-primary:active {
  transform: translateY(0) scale(0.97);
  box-shadow: none;
}
.btn-primary:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-ghost {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
}
.btn-ghost:hover {
  border-color: var(--border-hover);
  background: var(--surface-hover);
}
.btn-ghost:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
.btn-ghost:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

### Cards

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s ease;
}
.card::before {
  /* spotlight takip eden radial gradient, JS ile --mx/--my güncellenir */
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    280px circle at var(--mx, 50%) var(--my, 50%),
    rgba(var(--accent-rgb), 0.12),
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.card:hover {
  border-color: var(--border-hover);
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}
.card:hover::before {
  opacity: 1;
}
.card:focus-within {
  border-color: var(--accent);
}
```

### Navigation

```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: transparent;
  border-bottom: 1px solid transparent;
  backdrop-filter: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.nav.scrolled {
  background: rgba(var(--bg-rgb), 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom-color: var(--border);
}
.nav a {
  color: var(--text-secondary);
  transition: color 0.2s ease;
}
.nav a:hover,
.nav a:focus-visible {
  color: var(--text);
}
```

### Links

```css
.link {
  position: relative;
  color: var(--accent);
  text-decoration: none;
}
.link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--accent);
  transition: width 0.3s ease;
}
.link:hover::after,
.link:focus-visible::after {
  width: 100%;
}
.link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

### Tags / Badges

```css
.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  background: var(--surface);
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}
.tag:hover {
  border-color: var(--border-hover);
  color: var(--text);
}
```

## 5. Layout Principles

**Container:**
- Max width: 1200px
- Padding: 24px (mobil) / 32px (tablet) / 48px (masaüstü)
- Dar varyant (uzun metin bloğu, ör. iletişim formu): 640px

**Spacing Scale:**
- Section padding: 96px (masaüstü) / 64px (mobil)
- Component gap: 24-32px
- Kart iç padding: 32px (masaüstü) / 24px (mobil)

**Grid:**

```css
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.grid-bento {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.grid-bento > .span-2 {
  grid-column: span 2;
}
@media (max-width: 1024px) {
  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .grid-3,
  .grid-bento {
    grid-template-columns: 1fr;
  }
  .grid-bento > .span-2 {
    grid-column: span 1;
  }
}
```

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | Gölge yok, sadece `--border` | Section zeminleri, nav (scroll öncesi) |
| Subtle | `0 4px 16px rgba(0,0,0,0.3)` | Varsayılan kart durumu |
| Elevated | `0 12px 32px rgba(0,0,0,0.35)` + `border-hover` | Kart hover |
| Glow | `0 0 24px rgba(var(--accent-rgb),0.25)` | CTA butonu hover, aktif nav öğesi |

## 7. Animation & Interaction

**Motion Philosophy**: Abartısız ama canlı — her hareketin bir nedeni var, dekorasyon için hareket yok.
**Tier**: L2

### Dependencies

Harici CDN yok. `framer-motion` (zaten proje bağımlılığı) + native `IntersectionObserver`.

### Base Setup

```css
html {
  scroll-behavior: smooth;
}
[id] {
  scroll-margin-top: 96px;
}
```

### Entrance Animation

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}
.reveal.in-view > *:nth-child(1) {
  transition-delay: 0s;
}
.reveal.in-view > *:nth-child(2) {
  transition-delay: 0.1s;
}
.reveal.in-view > *:nth-child(3) {
  transition-delay: 0.2s;
}
.reveal.in-view > *:nth-child(4) {
  transition-delay: 0.3s;
}
```

### Scroll Behavior

- Nav: `scrollY > 50` → `.scrolled` sınıfı (arka plan blur + border).
- Section'lar: `IntersectionObserver` ile `.reveal` → `.reveal.in-view` (tek seferlik, `threshold: 0.15`).
- Hero arka planındaki iki "orb" için hafif CSS parallax (`translateY` scroll'a bağlı, düşük genlik, `will-change` sadece bu iki eleman için).

### Hover & Focus States

- Kartlar: `.card` spotlight (`--mx`/`--my`, rAF-throttled `pointermove`) + `translateY(-3px)`.
- Butonlar: `translateY(-1px)` + glow shadow (hover), `scale(0.97)` (active).
- Nav linkleri ve `.link`: renk geçişi + alt çizgi genişleme.
- Tüm interaktif öğeler: `:focus-visible` → `outline: 2px solid var(--accent)`.

### Special Effects

- **Hero spotlight**: `radial-gradient(600px circle at var(--mx) var(--my), rgba(var(--accent-rgb),0.10), transparent 60%)` — fare hareketiyle güncellenen tek katman, rAF-throttled.
- **Hizmet şeridi (marquee)**: Hero altında, hizmet anahtar kelimelerinin sürekli kaydığı ince bir CSS `translateX` şeridi (`animation-play-state: paused` on hover).
- **Bento spotlight kartlar**: "Neden Biz" bölümünde eşit olmayan (span-2/span-1 karışık) grid, her kart kendi spotlight'ına sahip.
- **Easter egg / 巧思**: Logo (`dörtyüzdört`) hover edildiğinde, altında monospace bir rozet beliriyor: `HTTP 404 — sayfa değil, çözüm bulundu.` (saf CSS opacity/translateY, JS yok).

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .reveal {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

## 8. Do's and Don'ts

### Do
- Tüm renkleri `var(--...)` üzerinden kullan, hiçbir component içine hex gömme.
- Her section'da tutarlı eyebrow + H2 ikilisi kullan (eyebrow: küçük, uppercase, `--accent`).
- Kartlarda tek baskın vurgu rengi (`--accent`) kullan; `--accent-2` yalnızca gradientte destekleyici.
- İkonları `lucide-react`'ten al, tutarlı `stroke-width` kullan.
- Her interaktif öğede hem `hover` hem `focus-visible` durumunu tanımla.
- Scroll reveal animasyonlarını tek seferlik yap (`IntersectionObserver.unobserve`), tekrar tetikleme.
- Mobilde CTA ve ikon butonlarını en az 44×44px dokunma alanıyla tasarla.

### Don't
- ❌ Düz gri/renk placeholder blok bırakma — görsel alanı yoksa gradient + doku (grid/nokta deseni) kullan, boş kutu bırakma.
- ❌ `backdrop-filter: blur()` değerini 14px üzerine çıkarma veya nav dışında geniş alanlarda kullanma.
- ❌ Hareket eden (parallax/translate) elemanlarda `filter: blur()` kullanma — performansı ciddi düşürür.
- ❌ Aynı ekranda ikiden fazla farklı vurgu rengi birden gösterme.
- ❌ `prefers-reduced-motion` düşüşü olmadan yeni bir animasyon ekleme.
- ❌ Gövde paragrafında (`p`) gradient, text-shadow veya italik kullanma.
- ❌ Emoji ile ikon değiştirme (Dark Tech tonuna aykırı, `lucide-react` kullan).
- ❌ Sürekli oynayan otomatik video/canvas arka plan bırakma (performans + pil maliyeti).

## 9. Responsive Behavior

**Breakpoints:**
| Name | Width | Key Changes |
|------|-------|-------------|
| Desktop | > 1024px | 3 kolonlu grid, tam nav, bento 4 kolon |
| Tablet | 640-1024px | 2 kolonlu grid, nav aynı, bento 2 kolon |
| Mobile | < 640px | Tek kolon, nav'da sadece logo + tek CTA, bento tek kolon |

**Touch Targets:** minimum 44×44px (butonlar, nav linkleri, ikon linkler)
**Collapsing Strategy:** Grid'ler önem sırasına göre tek kolona düşer; marquee şeridi mobilde daha kısa döngüyle devam eder; istatistik sayaçları yatay yerine dikey sıralanır; nav linkleri mobilde gizlenip yalnızca logo + "İletişim" CTA'sı kalır (ayrı bir hamburger menü gerektirmeyecek kadar az sayfa/link var).

```css
@media (max-width: 640px) {
  .container {
    padding-inline: 24px;
  }
  section {
    padding-block: 64px;
  }
  .nav-links {
    display: none;
  }
}
```
