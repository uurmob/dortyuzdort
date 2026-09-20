'use client'

import { useState, useTransition } from 'react'
import {
  updateSiteAyar, upsertProje, deleteProje, updateHizmet,
  updatePaket, updatePaketOzellikler, upsertEklenti, deleteEklenti,
  updateFiyatAyar, adminLogout,
} from '@/app/actions/admin'

const ACCENT = '#C8F135'
const BG = '#0A0A0A'
const BORDER = '#1a1a1a'
const BORDER2 = '#222'
const SIDEBAR = '#0d0d0d'
const TEXT_DIM = '#bbb'

type Toast = { msg: string; ok: boolean } | null

function useToast() {
  const [toast, setToast] = useState<Toast>(null)
  function show(msg: string, ok: boolean) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }
  return { toast, show }
}

function ToastBanner({ toast }: { toast: Toast }) {
  if (!toast) return null
  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999,
      background: toast.ok ? '#1a2a0a' : '#2a0a0a',
      border: `1px solid ${toast.ok ? ACCENT : '#c00'}`,
      color: toast.ok ? ACCENT : '#f66',
      padding: '12px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: 500,
    }}>
      {toast.msg}
    </div>
  )
}

function Input({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ fontSize: '11px', color: TEXT_DIM, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        style={{ background: '#111', border: `1px solid ${BORDER2}`, color: '#fff', padding: '10px 12px', fontSize: '14px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none', width: '100%' }} />
    </div>
  )
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ fontSize: '11px', color: TEXT_DIM, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
        style={{ background: '#111', border: `1px solid ${BORDER2}`, color: '#fff', padding: '10px 12px', fontSize: '14px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none', resize: 'vertical', width: '100%' }} />
    </div>
  )
}

function SaveBtn({ onClick, pending, label = 'Kaydet' }: { onClick: () => void; pending: boolean; label?: string }) {
  return (
    <button onClick={onClick} disabled={pending}
      style={{ background: ACCENT, color: BG, border: 'none', padding: '9px 20px', fontWeight: 700, fontSize: '13px', borderRadius: '4px', cursor: pending ? 'not-allowed' : 'pointer', opacity: pending ? 0.7 : 1 }}>
      {pending ? 'Kaydediliyor…' : label}
    </button>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <button onClick={() => onChange(!checked)}
        style={{ width: '44px', height: '24px', borderRadius: '12px', background: checked ? ACCENT : '#333', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: '3px', left: checked ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: checked ? BG : '#888', transition: 'left 0.2s' }} />
      </button>
      <span style={{ fontSize: '14px', color: checked ? ACCENT : TEXT_DIM }}>{label}</span>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#0d0d0d', border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '1.5rem', marginBottom: '1.5rem' }}>
      {children}
    </div>
  )
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: TEXT_DIM, marginBottom: '1.25rem', fontWeight: 600 }}>{children}</h3>
}

// ===================== TAB: GENEL AYARLAR =====================
function TabGenelAyarlar({ siteAyarlar }: { siteAyarlar: { anahtar: string; deger: string }[] }) {
  const { toast, show } = useToast()
  const [pending, startTransition] = useTransition()
  const map = Object.fromEntries(siteAyarlar.map(r => [r.anahtar, r.deger]))

  const [freelance, setFreelance] = useState(map['freelance_acik'] === 'true')
  const [hakkinda, setHakkinda] = useState(map['hakkinda_metin'] ?? '')
  const [stats, setStats] = useState({
    proje: map['istatistik_proje'] ?? '12',
    musteri: map['istatistik_musteri'] ?? '8',
    deneyim: map['istatistik_deneyim'] ?? '3',
    uptime: map['istatistik_uptime'] ?? '99',
  })

  function saveFreelance(v: boolean) {
    setFreelance(v)
    startTransition(async () => {
      const r = await updateSiteAyar('freelance_acik', String(v))
      show(r.error ? `Hata: ${r.error}` : 'Freelance durumu kaydedildi ✓', !r.error)
    })
  }

  function saveStats() {
    startTransition(async () => {
      const updates = [
        updateSiteAyar('istatistik_proje', stats.proje),
        updateSiteAyar('istatistik_musteri', stats.musteri),
        updateSiteAyar('istatistik_deneyim', stats.deneyim),
        updateSiteAyar('istatistik_uptime', stats.uptime),
      ]
      const results = await Promise.all(updates)
      const err = results.find(r => r.error)
      show(err ? `Hata: ${err.error}` : 'İstatistikler kaydedildi ✓', !err)
    })
  }

  function saveHakkinda() {
    startTransition(async () => {
      const r = await updateSiteAyar('hakkinda_metin', hakkinda)
      show(r.error ? `Hata: ${r.error}` : 'Hakkında metni kaydedildi ✓', !r.error)
    })
  }

  return (
    <div>
      <ToastBanner toast={toast} />
      <Card>
        <CardTitle>Freelance Durumu</CardTitle>
        <Toggle checked={freelance} onChange={saveFreelance} label={freelance ? 'Freelance Açık' : 'Freelance Kapalı'} />
      </Card>
      <Card>
        <CardTitle>İstatistikler</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <Input label="Tamamlanan Proje" value={stats.proje} onChange={v => setStats(s => ({ ...s, proje: v }))} type="number" />
          <Input label="Mutlu Müşteri" value={stats.musteri} onChange={v => setStats(s => ({ ...s, musteri: v }))} type="number" />
          <Input label="Yıllık Deneyim" value={stats.deneyim} onChange={v => setStats(s => ({ ...s, deneyim: v }))} type="number" />
          <Input label="Uptime (%)" value={stats.uptime} onChange={v => setStats(s => ({ ...s, uptime: v }))} type="number" />
        </div>
        <SaveBtn onClick={saveStats} pending={pending} />
      </Card>
      <Card>
        <CardTitle>Hakkında Metni</CardTitle>
        <Textarea label="Metin" value={hakkinda} onChange={setHakkinda} />
        <div style={{ marginTop: '1rem' }}>
          <SaveBtn onClick={saveHakkinda} pending={pending} />
        </div>
      </Card>
    </div>
  )
}

// ===================== TAB: PROJELER =====================
function TabProjeler({ initialProjeler }: { initialProjeler: Record<string, unknown>[] }) {
  const { toast, show } = useToast()
  const [pending, startTransition] = useTransition()
  const [projeler, setProjeler] = useState<Record<string, unknown>[]>(initialProjeler ?? [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ isim: '', aciklama: '', url: '', teknolojiler: '', one_cikan: false, sira: '0' })
  const [editId, setEditId] = useState<number | null>(null)

  function startEdit(p: Record<string, unknown>) {
    setEditId(p.id as number)
    setForm({
      isim: (p.isim as string) ?? '',
      aciklama: (p.aciklama as string) ?? '',
      url: (p.url as string) ?? '',
      teknolojiler: ((p.teknolojiler as string[]) ?? []).join(', '),
      one_cikan: (p.one_cikan as boolean) ?? false,
      sira: String(p.sira ?? 0),
    })
    setShowForm(true)
  }

  function resetForm() { setForm({ isim: '', aciklama: '', url: '', teknolojiler: '', one_cikan: false, sira: '0' }); setEditId(null); setShowForm(false) }

  function save() {
    startTransition(async () => {
      const data: Record<string, unknown> = {
        isim: form.isim, aciklama: form.aciklama, url: form.url,
        teknolojiler: form.teknolojiler.split(',').map(t => t.trim()).filter(Boolean),
        one_cikan: form.one_cikan, sira: parseInt(form.sira, 10),
      }
      if (editId) data.id = editId
      const r = await upsertProje(data)
      if (r.error) { show(`Hata: ${r.error}`, false); return }
      show('Proje kaydedildi ✓', true)
      resetForm()
      // refresh local state
      setProjeler(prev => {
        if (editId) return prev.map(p => p.id === editId ? { ...p, ...data } : p)
        return [...prev, { ...data, id: Date.now() }]
      })
    })
  }

  function remove(id: number) {
    startTransition(async () => {
      const r = await deleteProje(id)
      if (r.error) { show(`Hata: ${r.error}`, false); return }
      show('Proje silindi ✓', true)
      setProjeler(prev => prev.filter(p => p.id !== id))
    })
  }

  return (
    <div>
      <ToastBanner toast={toast} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '13px', color: TEXT_DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Projeler ({projeler.length})</h3>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={{ background: ACCENT, color: BG, border: 'none', padding: '8px 16px', fontWeight: 700, fontSize: '12px', borderRadius: '4px', cursor: 'pointer' }}>
            + Yeni Proje
          </button>
        )}
      </div>

      {projeler.map(p => (
        <div key={String(p.id)} style={{ border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 500, color: '#fff', fontSize: '14px' }}>{p.isim as string}</div>
            <div style={{ fontSize: '12px', color: TEXT_DIM, marginTop: '2px' }}>{(p.teknolojiler as string[] ?? []).join(' · ')}</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <button onClick={() => startEdit(p)} style={{ background: 'transparent', border: `1px solid ${BORDER2}`, color: TEXT_DIM, padding: '6px 12px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer' }}>Düzenle</button>
            <button onClick={() => remove(p.id as number)} style={{ background: 'transparent', border: '1px solid #400', color: '#f66', padding: '6px 12px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer' }}>Sil</button>
          </div>
        </div>
      ))}

      {showForm && (
        <Card>
          <CardTitle>{editId ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}</CardTitle>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <Input label="Proje Adı" value={form.isim} onChange={v => setForm(f => ({ ...f, isim: v }))} />
            <Textarea label="Açıklama" value={form.aciklama} onChange={v => setForm(f => ({ ...f, aciklama: v }))} />
            <Input label="URL" value={form.url} onChange={v => setForm(f => ({ ...f, url: v }))} />
            <Input label="Teknolojiler (virgülle ayır)" value={form.teknolojiler} onChange={v => setForm(f => ({ ...f, teknolojiler: v }))} />
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Toggle checked={form.one_cikan} onChange={v => setForm(f => ({ ...f, one_cikan: v }))} label="Öne Çıkan" />
              <div style={{ flex: 1, minWidth: '120px' }}>
                <Input label="Sıra" value={form.sira} onChange={v => setForm(f => ({ ...f, sira: v }))} type="number" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <SaveBtn onClick={save} pending={pending} label={editId ? 'Güncelle' : 'Kaydet'} />
              <button onClick={resetForm} style={{ background: 'transparent', border: `1px solid ${BORDER2}`, color: TEXT_DIM, padding: '9px 16px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer' }}>İptal</button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

// ===================== TAB: HİZMETLER =====================
function TabHizmetler({ initialHizmetler }: { initialHizmetler: Record<string, unknown>[] }) {
  const { toast, show } = useToast()
  const [pending, startTransition] = useTransition()
  const [hizmetler, setHizmetler] = useState<Record<string, unknown>[]>(initialHizmetler ?? [])

  function save(h: Record<string, unknown>) {
    startTransition(async () => {
      const r = await updateHizmet(h.id as number, { icon: h.icon, baslik: h.baslik, aciklama: h.aciklama })
      show(r.error ? `Hata: ${r.error}` : 'Hizmet kaydedildi ✓', !r.error)
    })
  }

  return (
    <div>
      <ToastBanner toast={toast} />
      {hizmetler.map((h, idx) => (
        <Card key={String(h.id)}>
          <CardTitle>Hizmet {idx + 1}</CardTitle>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem' }}>
              <Input label="İkon" value={h.icon as string} onChange={v => setHizmetler(prev => prev.map(x => x.id === h.id ? { ...x, icon: v } : x))} />
              <Input label="Başlık" value={h.baslik as string} onChange={v => setHizmetler(prev => prev.map(x => x.id === h.id ? { ...x, baslik: v } : x))} />
            </div>
            <Textarea label="Açıklama" value={h.aciklama as string} onChange={v => setHizmetler(prev => prev.map(x => x.id === h.id ? { ...x, aciklama: v } : x))} />
            <SaveBtn onClick={() => save(h)} pending={pending} />
          </div>
        </Card>
      ))}
    </div>
  )
}

// ===================== TAB: FİYAT AYARLARI =====================
function TabFiyatAyarlar({ initialFiyat }: { initialFiyat: { anahtar: string; deger: string }[] }) {
  const { toast, show } = useToast()
  const [pending, startTransition] = useTransition()
  const map = Object.fromEntries((initialFiyat ?? []).map(r => [r.anahtar, r.deger]))
  const [aktif, setAktif] = useState(map['indirim_aktif'] === 'true')
  const [oran, setOran] = useState(map['yillik_indirim'] ?? '15')

  function save() {
    startTransition(async () => {
      const r1 = await updateFiyatAyar('indirim_aktif', String(aktif))
      const r2 = await updateFiyatAyar('yillik_indirim', oran)
      const err = r1.error || r2.error
      show(err ? `Hata: ${err}` : 'Fiyat ayarları kaydedildi ✓', !err)
    })
  }

  return (
    <div>
      <ToastBanner toast={toast} />
      <Card>
        <CardTitle>Yıllık İndirim</CardTitle>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <Toggle checked={aktif} onChange={setAktif} label={aktif ? 'İndirim Aktif' : 'İndirim Pasif'} />
          <div style={{ maxWidth: '200px' }}>
            <Input label="İndirim Oranı (%)" value={oran} onChange={setOran} type="number" />
          </div>
          <SaveBtn onClick={save} pending={pending} />
        </div>
      </Card>
    </div>
  )
}

// ===================== TAB: PAKETLER =====================
type OzellikRow = { metin: string; dahil: boolean; sira: number }
type PaketRow = {
  id: number; slug: string; isim: string; icon: string; etiket: string
  kurulum: number; aylik: number; one_cikan: boolean; sira: number
  paket_ozellikler: (OzellikRow & { id: number })[]
}

function TabPaketler({ initialPaketler }: { initialPaketler: PaketRow[] }) {
  const { toast, show } = useToast()
  const [pending, startTransition] = useTransition()
  const [paketler, setPaketler] = useState<PaketRow[]>(initialPaketler ?? [])
  const [open, setOpen] = useState<number | null>(null)

  function savePaket(paket: PaketRow) {
    startTransition(async () => {
      const r1 = await updatePaket(paket.id, {
        icon: paket.icon, isim: paket.isim, etiket: paket.etiket,
        kurulum: paket.kurulum, aylik: paket.aylik, one_cikan: paket.one_cikan,
      })
      const r2 = await updatePaketOzellikler(paket.id, paket.paket_ozellikler.map((o, i) => ({ metin: o.metin, dahil: o.dahil, sira: i + 1 })))
      const err = r1.error || r2.error
      show(err ? `Hata: ${err}` : `${paket.isim} kaydedildi ✓`, !err)
    })
  }

  function setPaket(id: number, updater: (p: PaketRow) => PaketRow) {
    setPaketler(prev => prev.map(p => p.id === id ? updater(p) : p))
  }

  return (
    <div>
      <ToastBanner toast={toast} />
      {paketler.map(paket => (
        <div key={paket.id} style={{ border: `1px solid ${BORDER}`, borderRadius: '6px', marginBottom: '1rem', overflow: 'hidden' }}>
          <button onClick={() => setOpen(open === paket.id ? null : paket.id)}
            style={{ width: '100%', background: open === paket.id ? '#111' : SIDEBAR, border: 'none', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: '#fff' }}>
            <span style={{ fontWeight: 600, fontSize: '15px' }}>{paket.icon} {paket.isim}</span>
            <span style={{ color: TEXT_DIM, fontSize: '18px' }}>{open === paket.id ? '−' : '+'}</span>
          </button>
          {open === paket.id && (
            <div style={{ padding: '1.5rem', borderTop: `1px solid ${BORDER}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <Input label="İkon" value={paket.icon} onChange={v => setPaket(paket.id, p => ({ ...p, icon: v }))} />
                <Input label="Paket Adı" value={paket.isim} onChange={v => setPaket(paket.id, p => ({ ...p, isim: v }))} />
                <Input label="Etiket" value={paket.etiket} onChange={v => setPaket(paket.id, p => ({ ...p, etiket: v }))} />
                <Input label="Kurulum (₺)" value={String(paket.kurulum)} onChange={v => setPaket(paket.id, p => ({ ...p, kurulum: parseInt(v, 10) || 0 }))} type="number" />
                <Input label="Aylık (₺)" value={String(paket.aylik)} onChange={v => setPaket(paket.id, p => ({ ...p, aylik: parseInt(v, 10) || 0 }))} type="number" />
              </div>
              <Toggle checked={paket.one_cikan} onChange={v => setPaket(paket.id, p => ({ ...p, one_cikan: v }))} label="Öne Çıkan" />

              <div style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '11px', color: TEXT_DIM, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Özellikler</div>
                {paket.paket_ozellikler.map((oz, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <input value={oz.metin} onChange={e => setPaket(paket.id, p => ({ ...p, paket_ozellikler: p.paket_ozellikler.map((o, i) => i === idx ? { ...o, metin: e.target.value } : o) }))}
                      style={{ flex: 1, background: '#111', border: `1px solid ${BORDER2}`, color: '#fff', padding: '8px 10px', fontSize: '13px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none' }} />
                    <button onClick={() => setPaket(paket.id, p => ({ ...p, paket_ozellikler: p.paket_ozellikler.map((o, i) => i === idx ? { ...o, dahil: !o.dahil } : o) }))}
                      style={{ background: oz.dahil ? ACCENT : '#333', border: 'none', color: oz.dahil ? BG : TEXT_DIM, padding: '8px 12px', fontSize: '12px', fontWeight: 600, borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      {oz.dahil ? '✓ Dahil' : '✕ Hariç'}
                    </button>
                    <button onClick={() => setPaket(paket.id, p => ({ ...p, paket_ozellikler: p.paket_ozellikler.filter((_, i) => i !== idx) }))}
                      style={{ background: 'transparent', border: '1px solid #400', color: '#f66', padding: '8px 10px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
                <button onClick={() => setPaket(paket.id, p => ({ ...p, paket_ozellikler: [...p.paket_ozellikler, { id: Date.now(), metin: '', dahil: true, sira: p.paket_ozellikler.length + 1 }] }))}
                  style={{ background: 'transparent', border: `1px dashed ${BORDER2}`, color: TEXT_DIM, padding: '8px 16px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem' }}>
                  + Özellik Ekle
                </button>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <SaveBtn onClick={() => savePaket(paket)} pending={pending} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ===================== TAB: EKLENTİLER =====================
function TabEklentiler({ initialEklentiler }: { initialEklentiler: Record<string, unknown>[] }) {
  const { toast, show } = useToast()
  const [pending, startTransition] = useTransition()
  const [eklentiler, setEklentiler] = useState<Record<string, unknown>[]>(initialEklentiler ?? [])
  const [editId, setEditId] = useState<number | 'new' | null>(null)
  const blank = { icon: '🔧', isim: '', aciklama: '', fiyat: '0', birim: '/ay', sira: '0' }
  const [form, setForm] = useState({ ...blank })

  function startEdit(e: Record<string, unknown>) {
    setEditId(e.id as number)
    setForm({ icon: e.icon as string, isim: e.isim as string, aciklama: e.aciklama as string, fiyat: String(e.fiyat), birim: e.birim as string, sira: String(e.sira) })
  }

  function resetForm() { setForm({ ...blank }); setEditId(null) }

  function save() {
    startTransition(async () => {
      const data: Record<string, unknown> = { icon: form.icon, isim: form.isim, aciklama: form.aciklama, fiyat: parseInt(form.fiyat, 10) || 0, birim: form.birim, sira: parseInt(form.sira, 10) || 0 }
      if (editId !== 'new') data.id = editId
      else data.slug = form.isim.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
      const r = await upsertEklenti(data)
      if (r.error) { show(`Hata: ${r.error}`, false); return }
      show('Eklenti kaydedildi ✓', true)
      if (editId === 'new') setEklentiler(prev => [...prev, { ...data, id: Date.now() }])
      else setEklentiler(prev => prev.map(e => e.id === editId ? { ...e, ...data } : e))
      resetForm()
    })
  }

  function remove(id: number) {
    startTransition(async () => {
      const r = await deleteEklenti(id)
      if (r.error) { show(`Hata: ${r.error}`, false); return }
      show('Eklenti silindi ✓', true)
      setEklentiler(prev => prev.filter(e => e.id !== id))
    })
  }

  const thStyle: React.CSSProperties = { fontSize: '11px', color: TEXT_DIM, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 600, borderBottom: `1px solid ${BORDER}` }
  const tdStyle: React.CSSProperties = { padding: '0.75rem', fontSize: '13px', color: '#ccc', borderBottom: `1px solid ${BORDER}`, verticalAlign: 'middle' }

  return (
    <div>
      <ToastBanner toast={toast} />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>İkon</th>
              <th style={thStyle}>İsim</th>
              <th style={thStyle}>Açıklama</th>
              <th style={thStyle}>Fiyat</th>
              <th style={thStyle}>Birim</th>
              <th style={thStyle}>Sıra</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {eklentiler.map(e => (
              <tr key={String(e.id)}>
                {editId === e.id ? (
                  <>
                    <td style={tdStyle}><input value={form.icon} onChange={ev => setForm(f => ({ ...f, icon: ev.target.value }))} style={{ width: '50px', background: '#111', border: `1px solid ${BORDER2}`, color: '#fff', padding: '6px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none', textAlign: 'center' }} /></td>
                    <td style={tdStyle}><input value={form.isim} onChange={ev => setForm(f => ({ ...f, isim: ev.target.value }))} style={{ width: '100%', background: '#111', border: `1px solid ${BORDER2}`, color: '#fff', padding: '6px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none' }} /></td>
                    <td style={tdStyle}><input value={form.aciklama} onChange={ev => setForm(f => ({ ...f, aciklama: ev.target.value }))} style={{ width: '100%', background: '#111', border: `1px solid ${BORDER2}`, color: '#fff', padding: '6px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none' }} /></td>
                    <td style={tdStyle}><input type="number" value={form.fiyat} onChange={ev => setForm(f => ({ ...f, fiyat: ev.target.value }))} style={{ width: '80px', background: '#111', border: `1px solid ${BORDER2}`, color: '#fff', padding: '6px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none' }} /></td>
                    <td style={tdStyle}><input value={form.birim} onChange={ev => setForm(f => ({ ...f, birim: ev.target.value }))} style={{ width: '90px', background: '#111', border: `1px solid ${BORDER2}`, color: '#fff', padding: '6px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none' }} /></td>
                    <td style={tdStyle}><input type="number" value={form.sira} onChange={ev => setForm(f => ({ ...f, sira: ev.target.value }))} style={{ width: '50px', background: '#111', border: `1px solid ${BORDER2}`, color: '#fff', padding: '6px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none' }} /></td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={save} disabled={pending} style={{ background: ACCENT, color: BG, border: 'none', padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '4px', cursor: 'pointer' }}>Kaydet</button>
                        <button onClick={resetForm} style={{ background: 'transparent', border: `1px solid ${BORDER2}`, color: TEXT_DIM, padding: '6px 10px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer' }}>İptal</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={tdStyle}>{e.icon as string}</td>
                    <td style={tdStyle}>{e.isim as string}</td>
                    <td style={tdStyle}>{e.aciklama as string}</td>
                    <td style={tdStyle}>{(e.fiyat as number).toLocaleString('tr-TR')} ₺</td>
                    <td style={tdStyle}>{e.birim as string}</td>
                    <td style={tdStyle}>{e.sira as number}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => startEdit(e)} style={{ background: 'transparent', border: `1px solid ${BORDER2}`, color: TEXT_DIM, padding: '6px 10px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer' }}>Düzenle</button>
                        <button onClick={() => remove(e.id as number)} style={{ background: 'transparent', border: '1px solid #400', color: '#f66', padding: '6px 10px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer' }}>Sil</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {editId === 'new' && (
              <tr>
                <td style={tdStyle}><input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} style={{ width: '50px', background: '#111', border: `1px solid ${BORDER2}`, color: '#fff', padding: '6px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none', textAlign: 'center' }} /></td>
                <td style={tdStyle}><input value={form.isim} onChange={e => setForm(f => ({ ...f, isim: e.target.value }))} style={{ width: '100%', background: '#111', border: `1px solid ${BORDER2}`, color: '#fff', padding: '6px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none' }} placeholder="İsim" /></td>
                <td style={tdStyle}><input value={form.aciklama} onChange={e => setForm(f => ({ ...f, aciklama: e.target.value }))} style={{ width: '100%', background: '#111', border: `1px solid ${BORDER2}`, color: '#fff', padding: '6px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none' }} placeholder="Açıklama" /></td>
                <td style={tdStyle}><input type="number" value={form.fiyat} onChange={e => setForm(f => ({ ...f, fiyat: e.target.value }))} style={{ width: '80px', background: '#111', border: `1px solid ${BORDER2}`, color: '#fff', padding: '6px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none' }} /></td>
                <td style={tdStyle}><input value={form.birim} onChange={e => setForm(f => ({ ...f, birim: e.target.value }))} style={{ width: '90px', background: '#111', border: `1px solid ${BORDER2}`, color: '#fff', padding: '6px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none' }} /></td>
                <td style={tdStyle}><input type="number" value={form.sira} onChange={e => setForm(f => ({ ...f, sira: e.target.value }))} style={{ width: '50px', background: '#111', border: `1px solid ${BORDER2}`, color: '#fff', padding: '6px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none' }} /></td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={save} disabled={pending} style={{ background: ACCENT, color: BG, border: 'none', padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '4px', cursor: 'pointer' }}>Kaydet</button>
                    <button onClick={resetForm} style={{ background: 'transparent', border: `1px solid ${BORDER2}`, color: TEXT_DIM, padding: '6px 10px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer' }}>İptal</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button onClick={() => { resetForm(); setEditId('new') }}
        style={{ marginTop: '1rem', background: 'transparent', border: `1px dashed ${BORDER2}`, color: TEXT_DIM, padding: '10px 20px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
        + Yeni Eklenti Ekle
      </button>
    </div>
  )
}

// ===================== MAIN PANEL =====================
const TABS = [
  { id: 'genel', label: 'Genel Ayarlar', group: 'site' },
  { id: 'projeler', label: 'Projeler', group: 'site' },
  { id: 'hizmetler', label: 'Hizmetler', group: 'site' },
  { id: 'fiyat', label: 'Fiyat Ayarları', group: 'paket' },
  { id: 'paketler', label: 'Paketler', group: 'paket' },
  { id: 'eklentiler', label: 'Eklentiler', group: 'paket' },
] as const

type TabId = typeof TABS[number]['id']

export default function AdminPanel({
  projeler, hizmetler, siteAyarlar, paketler, eklentiler, fiyatAyarlar,
}: {
  projeler: Record<string, unknown>[] | null
  hizmetler: Record<string, unknown>[] | null
  siteAyarlar: Record<string, unknown>[] | null
  paketler: Record<string, unknown>[] | null
  eklentiler: Record<string, unknown>[] | null
  fiyatAyarlar: Record<string, unknown>[] | null
}) {
  const [tab, setTab] = useState<TabId>('genel')
  const [loggingOut, startLogout] = useTransition()

  function logout() {
    startLogout(async () => {
      await adminLogout()
      window.location.href = '/admin'
    })
  }

  const navItem = (t: typeof TABS[number]) => (
    <button key={t.id} onClick={() => setTab(t.id)}
      style={{ width: '100%', border: 'none', textAlign: 'left', padding: '8px 12px', fontSize: '13px', color: tab === t.id ? ACCENT : TEXT_DIM, cursor: 'pointer', borderRadius: '4px', fontFamily: 'inherit', fontWeight: tab === t.id ? 600 : 400, background: tab === t.id ? '#1a1a0a' : 'none' }}>
      {t.label}
    </button>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: BG, fontFamily: 'system-ui, sans-serif', color: '#fff' }}>
      {/* SIDEBAR */}
      <aside style={{ width: '240px', flexShrink: 0, background: SIDEBAR, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem' }}>
        <div style={{ marginBottom: '2rem', paddingLeft: '4px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', color: '#fff' }}>DÖRTYÜZDÖRT<span style={{ color: ACCENT }}>.</span></div>
          <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '2px' }}>Admin Paneli</div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '10px', color: '#444', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0 12px', marginBottom: '0.5rem' }}>Site Yönetimi</div>
          {TABS.filter(t => t.group === 'site').map(navItem)}
        </div>
        <div style={{ marginBottom: 'auto' }}>
          <div style={{ fontSize: '10px', color: '#444', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0 12px', marginBottom: '0.5rem' }}>Paket Yönetimi</div>
          {TABS.filter(t => t.group === 'paket').map(navItem)}
        </div>

        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <a href="/" target="_blank" style={{ display: 'block', padding: '8px 12px', fontSize: '12px', color: TEXT_DIM, textDecoration: 'none', borderRadius: '4px' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = TEXT_DIM)}>
            Siteyi Görüntüle ↗
          </a>
          <button onClick={logout} disabled={loggingOut}
            style={{ background: 'none', border: 'none', textAlign: 'left', padding: '8px 12px', fontSize: '12px', color: '#666', cursor: 'pointer', fontFamily: 'inherit', borderRadius: '4px' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f66')}
            onMouseLeave={e => (e.currentTarget.style.color = '#666')}>
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', maxHeight: '100vh' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '1.5rem', color: '#fff' }}>
          {TABS.find(t => t.id === tab)?.label}
        </h2>

        {tab === 'genel' && (
          <TabGenelAyarlar siteAyarlar={(siteAyarlar ?? []) as { anahtar: string; deger: string }[]} />
        )}
        {tab === 'projeler' && (
          <TabProjeler initialProjeler={(projeler ?? []) as Record<string, unknown>[]} />
        )}
        {tab === 'hizmetler' && (
          <TabHizmetler initialHizmetler={(hizmetler ?? []) as Record<string, unknown>[]} />
        )}
        {tab === 'fiyat' && (
          <TabFiyatAyarlar initialFiyat={(fiyatAyarlar ?? []) as { anahtar: string; deger: string }[]} />
        )}
        {tab === 'paketler' && (
          <TabPaketler initialPaketler={(paketler ?? []) as unknown as PaketRow[]} />
        )}
        {tab === 'eklentiler' && (
          <TabEklentiler initialEklentiler={(eklentiler ?? []) as Record<string, unknown>[]} />
        )}
      </main>
    </div>
  )
}
