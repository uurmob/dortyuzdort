# DESIGN.md

> Ham web'in dürüstlüğüyle konuşan, kocaman ve kendinden emin bir editoryal marka kimliği.

## 1. Visual Theme & Atmosphere

**Style**: Retro-OS Monokrom Editoryal (typesafe.ai referanslı)
**Keywords**: monokrom, iri tipografi, retro-OS pencereleri, ham/unstyled homage, brütalist gölge, pastel bulut, mono detaylar
**Tone**: Kendinden emin, teknik ama esprili — NOT karanlık/neon, NOT kurumsal-sıkıcı, NOT aşırı süslü
**Feel**: Beyaz bir galeri duvarında, eski bir işletim sisteminin pencere çerçeveleriyle sergilenen dev bir başlık.

**Interaction Tier**: L2 — Akıcı Etkileşim (scroll reveal, stagger, hover'da sert offset gölge, pastel imleç takibi)
**Dependencies**: CSS + IntersectionObserver (vanilla) + framer-motion (mevcut). GSAP/Lenis/WebGL yok.

## 2. Color Palette & Roles

```css
:root {
  /* Backgrounds */
  --bg: #fefefe; /* Sayfa zemini — neredeyse beyaz */
  --surface: #ffffff; /* Kart/panel zemini */
  --surface-alt: #f3f2ef; /* Alternatif section zemini (hafif sıcak gri) */
  --surface-hover: #ececea; /* Hover durumunda yüzey / form alanları */

  /* Borders */
  --border: #e3e2de; /* Sessiz iç ayraçlar */
  --border-hover: #1e1e1e;
  --border-strong: #1e1e1e; /* Kart/buton/pencere çerçeveleri — hep siyah */

  /* Text */
  --text: #1e1e1e; /* Başlıklar, önemli metin */
  --text-secondary: #55534d; /* Gövde metni */
  --text-tertiary: #918f88; /* Etiketler, ASCII ayraçlar */

  /* Accent — klasik "ham web" hyperlink mavisi, bir göz kırpma */
  --accent: #0000ee;
  --accent-hover: #3333ff;
  --accent-2: #d98fd9; /* Pastel bulut/blob için destekleyici */

  --bg-rgb: 254, 254, 254;
  --accent-rgb: 0, 0, 238;
  --accent-2-rgb: 217, 143, 217;

  --success: #1a7f37;
  --error: #cf222e;
  --warning: #9a6700;
}
```

**Color Rules:**
- Tüm renkler CSS custom property üzerinden kullanılır; component içine hardcoded hex gömülmez.
- Vurgu her yerde tek renk: `--accent` (mavi). `--accent-2` yalnızca Hero'daki pastel bulut gradyanında kullanılır, metinde asla.
- Kart/buton/pencere çerçeveleri hep `--border-strong` (siyah, 1.5px) — bu, "flat/brütalist" hissin temeli.

## 3. Typography Rules

**Font Stack:** Next.js `next/font/google` ile self-hosted:
- Heading: Space Grotesk (`next/font/google`, weight 500 — referanstaki "Die Grotesk Medium" homage'ı)
- Body: Inter (`next/font/google`, weights 400/500/600)
- Mono (pencere başlıkları, etiketler, ASCII ayraçlar): JetBrains Mono (`next/font/google`, weight 400/500)

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Hero H1 | Space Grotesk | clamp(2.75rem, 7vw, 6.5rem) | 500 | 1.02 | -0.02em |
| Section H2 | Space Grotesk | clamp(2rem, 4vw, 2.75rem) | 700 | 1.15 | -0.01em |
| H3 | Space Grotesk | 1.25rem | 600 | 1.3 | — |
| Body | Inter | 1.0625rem | 400 | 1.7 | 0 |
| Label / Eyebrow | JetBrains Mono | 0.8125rem | 500 | 1.4 | 0.06em (uppercase) |
| Mono / Detail | JetBrains Mono | 0.6875–0.875rem | 400/500 | 1.4–1.5 | 0–0.04em |

**Typography Rules:**
- Hero H1 kasıtlı olarak **medium (500)** ağırlıkta — kalın değil, iri punto zaten yeterli görsel ağırlığı veriyor.
- Türkçe karakterler tüm seçilen fontlarda native destekleniyor.
- **NEVER use**: sistem serif fontları, el yazısı fontlar, gövde metninde italik.

**Text Decoration:**
- Hero H1'in vurgulu kısmı (`.gradient-text`): düz `--accent` (mavi) rengi — gradient/glow yok, referanstaki ham hyperlink homage'ının devamı.
- Section H2: düz `--text`, dekorasyon yok.
- Eyebrow: mono font + `--accent` renginde küçük bir kare işaret (●/■ değil, 6px kare nokta).
- Gövde paragrafında (`p`) hiçbir dekorasyon yok.

## 4. Component Stylings

### Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border-radius: 4px;
  border: 1.5px solid var(--border-strong);
  font-weight: 600;
  font-size: 0.9375rem;
  min-height: 44px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.btn-primary {
  background: var(--text);
  color: var(--bg);
}
.btn-primary:hover,
.btn-ghost:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 var(--border-strong); /* sert offset gölge — brütalist imza */
}
.btn-primary:active,
.btn-ghost:active {
  transform: translate(0, 0);
  box-shadow: none;
}
.btn-ghost {
  background: var(--surface);
  color: var(--text);
}
.btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

### Cards

```css
.card {
  background: var(--surface);
  border: 1.5px solid var(--border-strong);
  border-radius: 4px;
  padding: 2rem;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card:hover,
.card:focus-within {
  transform: translate(-3px, -3px);
  box-shadow: 5px 5px 0 var(--border-strong);
}
```

### Navigation

```css
.nav {
  position: fixed;
  inset-inline: 0;
  top: 0;
  z-index: 100;
  background: var(--bg);
  border-bottom: 1.5px solid transparent;
  transition: border-color 0.2s ease;
}
.nav.scrolled {
  border-bottom-color: var(--border-strong);
}
```

Nav linkleri düz metin değil, `.btn.btn-ghost` — "büyük buton" görünümü (kullanıcı talebiyle eklendi).

### Links

```css
.link {
  position: relative;
  color: var(--text-secondary);
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
.link:hover,
.link:focus-visible {
  color: var(--accent);
}
.link:hover::after,
.link:focus-visible::after {
  width: 100%;
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
  border: 1.5px solid var(--border-strong);
  background: var(--surface);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}
```

### Retro Window (imza bileşen)

```css
.window {
  background: var(--surface);
  border: 1.5px solid var(--border-strong);
  border-radius: 2px;
  overflow: hidden;
}
.window-titlebar {
  display: flex;
  justify-content: space-between;
  background: var(--text);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  padding: 0.5rem 0.75rem;
}
.window-body {
  padding: 1.25rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-secondary);
}
```
Kullanım: Hero'da tek bir "dortyuzdort_os.exe — 404" durum penceresi. Aşırı kullanılmaz (tek yerde, dikkat çekmesi için).

## 5. Layout Principles

**Container:**
- Max width: 1200px
- Padding: 24px (mobil) / 32px (tablet) / 48px (masaüstü)

**Spacing Scale:**
- Section padding: 96px (masaüstü) / 64px (mobil)
- Component gap: 24-32px
- Kart iç padding: 32px (masaüstü) / 24px (mobil)

**Grid:** `grid-3` (3 kolon) ve `grid-bento` (4 kolon, span-2/span-4 destekli) — değişmedi, bkz. `app/globals.css`.

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | Sadece `--border` | Section zeminleri, nav (scroll öncesi) |
| Outlined | 1.5px solid `--border-strong` | Varsayılan kart/buton durumu |
| Offset | `4px 4px 0 var(--border-strong)` (sert, bulanıksız) | Kart/buton hover — glow YOK, blur YOK |

Not: Bu tema hiçbir yerde `box-shadow` blur kullanmaz — tüm gölgeler sert offset'tir (brütalist/neubrutalism imzası).

## 7. Animation & Interaction

**Motion Philosophy**: Abartısız ama canlı; hover'da "kağıt kalkıyor" hissi (sert offset gölge), glow yok.
**Tier**: L2

### Scroll Behavior
- Nav: `scrollY > 50` → `.scrolled` (siyah alt çizgi belirir, blur yok).
- Section'lar: `IntersectionObserver` ile `.reveal` → `.reveal.in-view` (tek seferlik).
- Hero: pastel "bulut" (`--accent-2` tonlarında, sabit) + fareyi takip eden çok hafif pastel spotlight.

### Hover & Focus States
- Kart/buton: `translate(-2px,-2px)` + `box-shadow: 4-5px 4-5px 0 var(--border-strong)`.
- Link: renk `--text-secondary` → `--accent`, alt çizgi genişler.
- Tüm interaktif öğeler: `:focus-visible` → `outline: 2px solid var(--accent)`.

### Special Effects
- **Hero bulutu**: `hero-cloud` — 3 katmanlı pastel radial-gradient, `blur(40px)`, statik (performans için sabit, mouse'a bağlı değil).
- **Hero spotlight**: çok düşük opasiteli (`0.18`) pastel imleç takibi, rAF-throttled.
- **Retro pencere**: Hero'da tek bir "dortyuzdort_os.exe" durum penceresi (bkz. Component Stylings).
- **ASCII ayraç**: Bölümler arası `∵ ⩆   ⩆ ∵` (mono font, `--text-tertiary`) — referans sitenin imza detayı, kendi 404 esprimizle uyumlu.
- **Easter egg**: Logo hover → `HTTP 404 — sayfa değil, çözüm bulundu.` rozeti (değişmedi).

### Reduced Motion
Değişmedi — bkz. `app/globals.css` `@media (prefers-reduced-motion: reduce)`.

## 8. Do's and Don'ts

### Do
- Tüm renkleri `var(--...)` üzerinden kullan.
- Kart/buton çerçevelerini hep `--border-strong` (siyah, 1.5px) yap.
- Hover'da sert offset gölge kullan (`Npx Npx 0 var(--border-strong)`), asla blur'lu glow ekleme.
- Vurgu rengini (`--accent`, mavi) tutumlu kullan — sadece linkler, ikonlar, eyebrow noktası, hero'nun vurgulu kelimesi.
- İkonları `lucide-react`'ten al, `stroke-width` tutarlı tut.
- Mobilde CTA ve ikon butonlarını en az 44×44px yap.

### Don't
- ❌ Herhangi bir yerde bulanık (`blur()`) box-shadow veya glow ekleme — bu tema tamamen sert/flat.
- ❌ Köşeleri 8px'in üzerine yuvarlama (kartlar/butonlar 2-4px, sadece `.tag` ve pilller tam yuvarlak kalabilir).
- ❌ İkiden fazla vurgu rengi birden gösterme.
- ❌ `prefers-reduced-motion` düşüşü olmadan yeni animasyon ekleme.
- ❌ Gövde paragrafında gradient, text-shadow veya italik kullanma.
- ❌ Emoji ile ikon değiştirme.
- ❌ ASCII ayracı her section arasına basmak (aşırı kullanım etkisini yitirir — 2-3 yerde yeter).
- ❌ Retro pencere bileşenini birden fazla yerde tekrarlamak (imza detay, tek seferlik kalmalı).

## 9. Responsive Behavior

**Breakpoints:**
| Name | Width | Key Changes |
|------|-------|-------------|
| Desktop | > 1024px | 3 kolonlu grid, tam nav (buton-link'ler), bento 4 kolon |
| Tablet | 640-1024px | 2 kolonlu grid, bento 2 kolon |
| Mobile | < 640px | Tek kolon, nav'da sadece logo + "Görüşelim" CTA'sı |

**Touch Targets:** minimum 44×44px
**Collapsing Strategy:** Değişmedi — bkz. önceki sürüm; nav-links mobilde gizlenir, tek CTA kalır.
