import { createClient } from '@/lib/supabase/server'
import PaketlerClient from './PaketlerClient'

export const revalidate = 60

const FALLBACK_PAKETLER = [
  {
    id: 1, slug: 'baslangic', isim: 'Başlangıç', icon: '🌱',
    etiket: 'Yeni başlayan işletmeler için', kurulum: 5000, aylik: 2500,
    one_cikan: false, sira: 1, aktif: true,
    paket_ozellikler: [
      { id: 1, metin: '5 sayfalık web sitesi', dahil: true, sira: 1 },
      { id: 2, metin: 'Randevu formu', dahil: true, sira: 2 },
      { id: 3, metin: 'Mobil uyumlu tasarım', dahil: true, sira: 3 },
      { id: 4, metin: 'SSL + hosting dahil', dahil: true, sira: 4 },
      { id: 5, metin: '2 blog yazısı / ay', dahil: true, sira: 5 },
      { id: 6, metin: 'E-posta bülteni', dahil: false, sira: 6 },
      { id: 7, metin: 'Aylık rapor', dahil: false, sira: 7 },
    ],
  },
  {
    id: 2, slug: 'buyume', isim: 'Büyüme', icon: '📈',
    etiket: 'En çok tercih edilen paket', kurulum: 12000, aylik: 4500,
    one_cikan: true, sira: 2, aktif: true,
    paket_ozellikler: [
      { id: 8, metin: '8 sayfalık web sitesi', dahil: true, sira: 1 },
      { id: 9, metin: 'Online randevu sistemi', dahil: true, sira: 2 },
      { id: 10, metin: 'Mobil uyumlu + hızlı', dahil: true, sira: 3 },
      { id: 11, metin: 'SSL + hosting dahil', dahil: true, sira: 4 },
      { id: 12, metin: '4 blog yazısı / ay', dahil: true, sira: 5 },
      { id: 13, metin: 'Aylık performans raporu', dahil: true, sira: 6 },
      { id: 14, metin: 'E-posta bülteni', dahil: false, sira: 7 },
    ],
  },
  {
    id: 3, slug: 'pro', isim: 'Pro', icon: '🚀',
    etiket: 'Tam kapsamlı dijital yönetim', kurulum: 18000, aylik: 7500,
    one_cikan: false, sira: 3, aktif: true,
    paket_ozellikler: [
      { id: 15, metin: '12 sayfalık web sitesi', dahil: true, sira: 1 },
      { id: 16, metin: 'Online randevu + hatırlatma', dahil: true, sira: 2 },
      { id: 17, metin: 'SEO optimizasyonu', dahil: true, sira: 3 },
      { id: 18, metin: 'SSL + hosting dahil', dahil: true, sira: 4 },
      { id: 19, metin: '8 blog yazısı / ay', dahil: true, sira: 5 },
      { id: 20, metin: 'Aylık detaylı rapor', dahil: true, sira: 6 },
      { id: 21, metin: 'Aylık e-posta bülteni', dahil: true, sira: 7 },
    ],
  },
]

const FALLBACK_EKLENTILER = [
  { id: 1, slug: 'whatsapp', isim: 'WhatsApp Chatbot', icon: '💬', aciklama: 'Otomatik soru cevaplama, randevu yönlendirme', fiyat: 500, birim: '/ay', sira: 1 },
  { id: 2, slug: 'gads', isim: 'Google Ads Yönetimi', icon: '🎯', aciklama: "Reklam bütçesinin %15i — min. ücret dahil", fiyat: 1000, birim: '/ay min.', sira: 2 },
  { id: 3, slug: 'hasta_panel', isim: 'Hasta Yönetim Paneli', icon: '🗂️', aciklama: 'Kayıt, takip, diyet notu, randevu geçmişi', fiyat: 3500, birim: 'tek seferlik', sira: 3 },
  { id: 4, slug: 'seo', isim: 'Aylık SEO Paketi', icon: '📊', aciklama: 'Anahtar kelime raporu + içerik optimizasyonu', fiyat: 2000, birim: '/ay', sira: 4 },
  { id: 5, slug: 'email', isim: 'E-posta Bülteni', icon: '✉️', aciklama: 'Aylık hasta bülteni tasarım + gönderim', fiyat: 800, birim: '/ay', sira: 5 },
  { id: 6, slug: 'cokdil', isim: 'Çok Dil Desteği', icon: '🌍', aciklama: 'İngilizce / Arapça tam site çevirisi + SEO', fiyat: 4000, birim: 'tek seferlik', sira: 6 },
]

const FALLBACK_FIYAT = { yillik_indirim: '15', indirim_aktif: 'true' }

export default async function PaketlerPage() {
  let paketler = FALLBACK_PAKETLER
  let eklentiler = FALLBACK_EKLENTILER
  let fiyatAyarlar: Record<string, string> = { ...FALLBACK_FIYAT }

  try {
    const supabase = await createClient()

    const [paketlerRes, eklentilerRes, fiyatRes] = await Promise.all([
      supabase
        .from('paketler')
        .select('*, paket_ozellikler(id, metin, dahil, sira)')
        .eq('aktif', true)
        .order('sira'),
      supabase
        .from('eklentiler')
        .select('*')
        .eq('aktif', true)
        .order('sira'),
      supabase.from('fiyat_ayarlar').select('*'),
    ])

    if (paketlerRes.data && paketlerRes.data.length > 0) paketler = paketlerRes.data
    if (eklentilerRes.data && eklentilerRes.data.length > 0) eklentiler = eklentilerRes.data
    if (fiyatRes.data) {
      const map: Record<string, string> = {}
      fiyatRes.data.forEach((r: { anahtar: string; deger: string }) => { map[r.anahtar] = r.deger })
      if (Object.keys(map).length > 0) fiyatAyarlar = map
    }
  } catch {
    // Supabase bağlantısı yoksa fallback data kullan
  }

  return (
    <PaketlerClient
      paketler={paketler}
      eklentiler={eklentiler}
      fiyatAyarlar={fiyatAyarlar}
    />
  )
}
