'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const ACCENT = '#C8F135'
const BG = '#0A0A0A'
const BORDER = '#1a1a1a'
const BORDER2 = '#222'
const TEXT_DIM = '#bbb'
const TEXT_DIMMER = '#666'

type Ozellik = { id: number; metin: string; dahil: boolean; sira: number }
type Paket = {
  id: number; slug: string; isim: string; icon: string; etiket: string
  kurulum: number; aylik: number; one_cikan: boolean; sira: number; aktif: boolean
  paket_ozellikler: Ozellik[]
}
type Eklenti = {
  id: number; slug: string; isim: string; icon: string; aciklama: string
  fiyat: number; birim: string; sira: number
}

function fmt(n: number) {
  return n.toLocaleString('tr-TR') + ' ₺'
}

export default function PaketlerClient({
  paketler,
  eklentiler,
  fiyatAyarlar,
}: {
  paketler: Paket[]
  eklentiler: Eklenti[]
  fiyatAyarlar: Record<string, string>
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [yillik, setYillik] = useState(false)
  const [seciliPaket, setSeciliPaket] = useState<number | null>(null)
  const [seciliEklentiler, setSeciliEklentiler] = useState<Set<number>>(new Set())
  const breakdownRef = useRef<HTMLDivElement>(null)

  const indirimAktif = fiyatAyarlar['indirim_aktif'] === 'true'
  const indirimOrani = parseInt(fiyatAyarlar['yillik_indirim'] ?? '15', 10)

  const navLinks = [
    { label: 'Hizmetler', href: '/#hizmetler' },
    { label: 'Projeler', href: '/#projeler' },
    { label: 'Paketler', href: '/paketler' },
    { label: 'Hakkında', href: '/#hakkında' },
    { label: 'İletişim', href: '/#iletişim' },
  ]

  function aylikFiyat(paket: Paket) {
    if (yillik && indirimAktif) return Math.round(paket.aylik * (1 - indirimOrani / 100))
    return paket.aylik
  }

  function yillikToplam(paket: Paket) {
    return aylikFiyat(paket) * 12 + paket.kurulum
  }

  function toggleEklenti(id: number) {
    setSeciliEklentiler(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const secilenPaket = paketler.find(p => p.id === seciliPaket)
  const secilenEklentiler = eklentiler.filter(e => seciliEklentiler.has(e.id))
  const aylikEklentiToplam = secilenEklentiler
    .filter(e => e.birim !== 'tek seferlik')
    .reduce((sum, e) => sum + e.fiyat, 0)
  const tekSeferlikEklenti = secilenEklentiler
    .filter(e => e.birim === 'tek seferlik')
    .reduce((sum, e) => sum + e.fiyat, 0)

  const toplamAylik = (secilenPaket ? aylikFiyat(secilenPaket) : 0) + aylikEklentiToplam

  return (
    <main style={{ background: BG, minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 3rem', borderBottom: `1px solid ${BORDER}`, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)' }}>
        <Link href="/" style={{ fontWeight: 700, letterSpacing: '0.12em', fontSize: '15px', color: '#fff', textDecoration: 'none' }}>
          DÖRTYÜZDÖRT<span style={{ color: ACCENT }}>.</span>
        </Link>
        <div className="nav-links" style={{ display: 'flex', gap: '2rem', fontSize: '13px' }}>
          {navLinks.map(item => (
            <Link key={item.label} href={item.href}
              style={{ color: item.href === '/paketler' ? ACCENT : TEXT_DIM, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = item.href === '/paketler' ? ACCENT : '#999')}>
              {item.label}
            </Link>
          ))}
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <span style={{ width: '22px', height: '1.5px', background: menuOpen ? ACCENT : '#fff', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(4px,4px)' : 'none' }} />
          <span style={{ width: '22px', height: '1.5px', background: '#fff', display: 'block', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.3s' }} />
          <span style={{ width: '22px', height: '1.5px', background: menuOpen ? ACCENT : '#fff', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(4px,-4px)' : 'none' }} />
        </button>
      </nav>

      {menuOpen && (
        <div style={{ position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 99, background: 'rgba(10,10,10,0.98)', borderBottom: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '1.5rem' }}>
          {navLinks.map(item => (
            <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
              style={{ color: '#ccc', textDecoration: 'none', fontSize: '16px' }}>{item.label}</Link>
          ))}
        </div>
      )}

      {/* HERO */}
      <section style={{ position: 'relative', paddingTop: '10rem', paddingBottom: '5rem', paddingLeft: '3rem', paddingRight: '3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.3em', color: ACCENT, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          Hizmet Fiyatlandırması
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', fontWeight: 500, lineHeight: 1.05, margin: '0 auto 1.5rem', color: '#fff', maxWidth: '700px' }}>
          Paket Fiyatları
        </h1>
        <p style={{ color: '#ccc', fontSize: '16px', lineHeight: 1.8, maxWidth: '450px', margin: '0 auto' }}>
          Projenize en uygun paketi seçin. İstediğiniz eklentilerle özelleştirin.
        </p>

        {/* TOGGLE */}
        {indirimAktif && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2.5rem' }}>
            <span style={{ fontSize: '14px', color: yillik ? TEXT_DIM : '#fff' }}>Aylık</span>
            <button onClick={() => setYillik(!yillik)}
              style={{ width: '52px', height: '28px', borderRadius: '14px', background: yillik ? ACCENT : '#222', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s' }}>
              <span style={{ position: 'absolute', top: '4px', left: yillik ? '28px' : '4px', width: '20px', height: '20px', borderRadius: '50%', background: yillik ? BG : '#666', transition: 'left 0.3s' }} />
            </button>
            <span style={{ fontSize: '14px', color: yillik ? '#fff' : TEXT_DIM }}>Yıllık</span>
            {yillik && (
              <span style={{ background: ACCENT, color: BG, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', letterSpacing: '0.05em' }}>
                %{indirimOrani} İNDİRİM
              </span>
            )}
          </div>
        )}
      </section>

      {/* STEP 1 — PAKETLER */}
      <section style={{ padding: '0 3rem 5rem' }}>
        <SectionLabel>1. Paket Seçin</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', maxWidth: '1100px', margin: '1.5rem auto 0' }}>
          {paketler.map(paket => {
            const selected = seciliPaket === paket.id
            return (
              <div key={paket.id} onClick={() => setSeciliPaket(selected ? null : paket.id)}
                style={{
                  position: 'relative', border: `1px solid ${selected ? ACCENT : paket.one_cikan ? '#333' : BORDER2}`,
                  borderRadius: '6px', padding: '1.75rem', cursor: 'pointer', transition: 'all 0.25s',
                  background: selected ? '#0d100a' : paket.one_cikan ? '#0d0d0d' : 'transparent',
                }}>

                {paket.one_cikan && (
                  <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', background: ACCENT, color: BG, fontSize: '10px', fontWeight: 700, padding: '3px 14px', letterSpacing: '0.08em', borderRadius: '0 0 6px 6px' }}>
                    EN ÇOK TERCİH EDİLEN
                  </div>
                )}

                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${selected ? ACCENT : '#444'}`, background: selected ? ACCENT : 'transparent', transition: 'all 0.2s' }}>
                  {selected && <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '7px', height: '7px', borderRadius: '50%', background: BG, display: 'block' }} />}
                </div>

                <div style={{ fontSize: '2rem', marginBottom: '0.75rem', marginTop: paket.one_cikan ? '0.75rem' : '0' }}>{paket.icon}</div>
                <div style={{ fontWeight: 600, fontSize: '18px', color: '#fff', marginBottom: '0.25rem' }}>{paket.isim}</div>
                <div style={{ fontSize: '12px', color: TEXT_DIM, marginBottom: '1.5rem' }}>{paket.etiket}</div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '11px', color: TEXT_DIM }}>Kurulum:</span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#fff' }}>{fmt(paket.kurulum)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 600, color: selected ? ACCENT : '#fff', transition: 'color 0.2s' }}>{fmt(aylikFiyat(paket))}</span>
                  <span style={{ fontSize: '13px', color: TEXT_DIM }}>/ay</span>
                </div>
                {yillik && indirimAktif && (
                  <div style={{ fontSize: '12px', color: TEXT_DIMMER, marginBottom: '0.25rem' }}>
                    Yıllık toplam: {fmt(yillikToplam(paket))}
                  </div>
                )}

                <div style={{ borderTop: `1px solid ${BORDER}`, margin: '1.25rem 0', paddingTop: '1.25rem' }}>
                  {[...paket.paket_ozellikler].sort((a, b) => a.sira - b.sira).map(oz => (
                    <div key={oz.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: oz.dahil ? ACCENT : TEXT_DIMMER, flexShrink: 0 }}>
                        {oz.dahil ? '✓' : '✕'}
                      </span>
                      <span style={{ fontSize: '13px', color: oz.dahil ? '#ccc' : TEXT_DIMMER, textDecoration: oz.dahil ? 'none' : 'line-through' }}>
                        {oz.metin}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* STEP 2 — EKLENTİLER */}
      <section style={{ padding: '0 3rem 5rem', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ paddingTop: '3rem' }}>
          <SectionLabel>2. Eklenti Seçin <span style={{ fontWeight: 400, fontSize: '13px', color: TEXT_DIM }}>(isteğe bağlı)</span></SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', maxWidth: '1100px', margin: '1.5rem auto 0' }}>
            {eklentiler.map(e => {
              const active = seciliEklentiler.has(e.id)
              return (
                <div key={e.id} onClick={() => toggleEklenti(e.id)}
                  style={{
                    border: `1px solid ${active ? ACCENT : BORDER2}`, borderRadius: '6px', padding: '1.25rem',
                    cursor: 'pointer', transition: 'all 0.2s', background: active ? '#0d100a' : 'transparent',
                    display: 'flex', gap: '0.9rem', alignItems: 'flex-start',
                  }}>
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{e.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '14px', color: '#fff', marginBottom: '0.25rem' }}>{e.isim}</div>
                    <div style={{ fontSize: '12px', color: TEXT_DIM, marginBottom: '0.6rem', lineHeight: 1.5 }}>{e.aciklama}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: active ? ACCENT : '#fff' }}>
                      {fmt(e.fiyat)} <span style={{ fontWeight: 400, color: TEXT_DIM }}>{e.birim}</span>
                    </div>
                  </div>
                  <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: `2px solid ${active ? ACCENT : '#444'}`, background: active ? ACCENT : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', marginTop: '2px' }}>
                    {active && <span style={{ color: BG, fontSize: '10px', fontWeight: 700 }}>✓</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* BREAKDOWN */}
      {secilenPaket && (
        <section ref={breakdownRef} style={{ padding: '0 3rem 5rem', borderTop: `1px solid ${BORDER}` }}>
          <div style={{ paddingTop: '3rem', maxWidth: '600px', margin: '0 auto' }}>
            <SectionLabel>Fiyat Özeti</SectionLabel>
            <div style={{ marginTop: '1.5rem', border: `1px solid ${BORDER}`, borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#fff' }}>{secilenPaket.icon} {secilenPaket.isim} paketi — kurulum</span>
                <span style={{ fontSize: '14px', color: TEXT_DIM }}>{fmt(secilenPaket.kurulum)}</span>
              </div>
              <div style={{ padding: '1rem 1.5rem', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#fff' }}>{secilenPaket.isim} aylık</span>
                <span style={{ fontSize: '14px', color: TEXT_DIM }}>{fmt(aylikFiyat(secilenPaket))} /ay</span>
              </div>
              {secilenEklentiler.map(e => (
                <div key={e.id} style={{ padding: '1rem 1.5rem', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#ccc' }}>{e.icon} {e.isim}</span>
                  <span style={{ fontSize: '14px', color: TEXT_DIM }}>{fmt(e.fiyat)} {e.birim}</span>
                </div>
              ))}
              <div style={{ padding: '1.25rem 1.5rem', background: '#0d0d0d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: TEXT_DIM, marginBottom: '4px' }}>Aylık toplam</div>
                  <div style={{ fontSize: '22px', fontWeight: 600, color: ACCENT }}>{fmt(toplamAylik)}</div>
                </div>
                {yillik && indirimAktif && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: TEXT_DIM, marginBottom: '4px' }}>Yıllık toplam (kurulum dahil)</div>
                    <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff' }}>{fmt(toplamAylik * 12 + secilenPaket.kurulum + tekSeferlikEklenti)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ padding: '2rem 3rem', borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.1em', color: '#fff' }}>DÖRTYÜZDÖRT<span style={{ color: ACCENT }}>.</span></div>
        <div style={{ fontSize: '12px', color: TEXT_DIM }}>© 2026 DörtYüzDört. Tüm hakları saklıdır.</div>
      </footer>

      {/* STICKY BAR */}
      {secilenPaket && (
        <StickyBar
          paketIsim={secilenPaket.isim}
          eklentiSayisi={seciliEklentiler.size}
          toplamAylik={toplamAylik}
        />
      )}
    </main>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '11px', letterSpacing: '0.25em', color: ACCENT, textTransform: 'uppercase', fontWeight: 600 }}>
      {children}
    </div>
  )
}

function StickyBar({ paketIsim, eklentiSayisi, toplamAylik }: { paketIsim: string; eklentiSayisi: number; toplamAylik: number }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
      background: '#0f0f0f', borderTop: `1px solid ${BORDER}`,
      backdropFilter: 'blur(12px)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 3rem', gap: '1rem', flexWrap: 'wrap',
    }}>
      <div>
        <div style={{ fontWeight: 500, fontSize: '15px', color: '#fff' }}>{paketIsim} paketi</div>
        <div style={{ fontSize: '12px', color: TEXT_DIM, marginTop: '2px' }}>
          {eklentiSayisi > 0 ? `+ ${eklentiSayisi} eklenti` : 'Eklenti seçilmedi'}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: TEXT_DIM }}>Aylık toplam</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: ACCENT }}>{fmt(toplamAylik)}</div>
        </div>
        <a href="/#iletişim"
          style={{ background: ACCENT, color: BG, padding: '13px 28px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', borderRadius: '4px', whiteSpace: 'nowrap' }}>
          Teklif Al →
        </a>
      </div>
    </div>
  )
}
