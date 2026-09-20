-- ============================================================
-- dortyuzdort.com — Supabase Setup SQL
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- ==================== SITE TABLES ====================

-- Projects (Projeler / Referanslar section)
CREATE TABLE IF NOT EXISTS projeler (
  id          BIGSERIAL PRIMARY KEY,
  isim        TEXT NOT NULL,
  aciklama    TEXT,
  url         TEXT,
  teknolojiler TEXT[], -- e.g. ['Next.js', 'Supabase']
  gorsel_url  TEXT,
  one_cikan   BOOLEAN DEFAULT false,
  sira        SMALLINT DEFAULT 0,
  aktif       BOOLEAN DEFAULT true,
  olusturuldu TIMESTAMPTZ DEFAULT NOW()
);

-- Services (Hizmetler section)
CREATE TABLE IF NOT EXISTS hizmetler (
  id          BIGSERIAL PRIMARY KEY,
  icon        TEXT NOT NULL DEFAULT '⬡',
  baslik      TEXT NOT NULL,
  aciklama    TEXT,
  sira        SMALLINT DEFAULT 0,
  aktif       BOOLEAN DEFAULT true
);

-- Site-wide settings
CREATE TABLE IF NOT EXISTS site_ayarlar (
  anahtar     TEXT PRIMARY KEY,
  deger       TEXT NOT NULL,
  aciklama    TEXT
);

-- ==================== PAKETLER TABLES ====================

-- Packages
CREATE TABLE IF NOT EXISTS paketler (
  id          BIGSERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  isim        TEXT NOT NULL,
  icon        TEXT DEFAULT '📦',
  etiket      TEXT DEFAULT '',
  kurulum     INTEGER DEFAULT 0,
  aylik       INTEGER DEFAULT 0,
  one_cikan   BOOLEAN DEFAULT false,
  sira        SMALLINT DEFAULT 0,
  aktif       BOOLEAN DEFAULT true
);

-- Package features
CREATE TABLE IF NOT EXISTS paket_ozellikler (
  id          BIGSERIAL PRIMARY KEY,
  paket_id    BIGINT NOT NULL REFERENCES paketler(id) ON DELETE CASCADE,
  metin       TEXT NOT NULL,
  dahil       BOOLEAN DEFAULT true,
  sira        SMALLINT DEFAULT 0
);

-- Add-ons
CREATE TABLE IF NOT EXISTS eklentiler (
  id          BIGSERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  isim        TEXT NOT NULL,
  icon        TEXT DEFAULT '🔧',
  aciklama    TEXT DEFAULT '',
  fiyat       INTEGER DEFAULT 0,
  birim       TEXT DEFAULT '/ay', -- '/ay' or 'tek seferlik'
  sira        SMALLINT DEFAULT 0,
  aktif       BOOLEAN DEFAULT true
);

-- Pricing settings
CREATE TABLE IF NOT EXISTS fiyat_ayarlar (
  anahtar     TEXT PRIMARY KEY,
  deger       TEXT NOT NULL
);

-- ==================== SEED DATA ====================

-- Site settings
INSERT INTO site_ayarlar (anahtar, deger, aciklama) VALUES
  ('freelance_acik', 'true', 'Freelance durumu'),
  ('hakkinda_metin', 'Gündüzleri sistem destek şefi olarak çalışıyor, geceleri ise Next.js, yapay zeka ve web teknolojileriyle projeler geliştiriyorum.', 'Hakkında sayfası metni'),
  ('istatistik_proje', '12', 'Tamamlanan proje sayısı'),
  ('istatistik_musteri', '8', 'Mutlu müşteri sayısı'),
  ('istatistik_deneyim', '3', 'Yıllık deneyim'),
  ('istatistik_uptime', '99', 'Uptime yüzdesi')
ON CONFLICT (anahtar) DO UPDATE SET deger = EXCLUDED.deger;

-- Services
INSERT INTO hizmetler (icon, baslik, aciklama, sira) VALUES
  ('⬡', 'Web Tasarım', 'Modern, hızlı ve dönüşüm odaklı web siteleri. Her proje özgün tasarım anlayışıyla hayata geçirilir.', 1),
  ('◈', 'SEO', 'Google''da üst sıralara çıkın. Teknik SEO, içerik stratejisi ve rakip analiziyle organik büyüme.', 2),
  ('▣', 'Hosting', 'Güvenli, hızlı ve kesintisiz altyapı. Verileriniz her gece yedeklenir, 7/24 izleme.', 3),
  ('⬘', 'Dashboard', 'Klinik, ajans veya işletmenize özel yönetim panelleri. Excel''e veda edin.', 4)
ON CONFLICT DO NOTHING;

-- Projects
INSERT INTO projeler (isim, aciklama, url, teknolojiler, one_cikan, sira) VALUES
  ('Diyetisyen Web Sitesi', 'Selen Şenman için kişisel web sitesi', 'https://www.selensenman.com', ARRAY['PHP', 'MySQL', 'Admin Panel'], true, 1),
  ('Klinik Yönetim Sistemi', 'Hastane Dashboard', NULL, ARRAY['Next.js', 'Supabase', 'Dashboard'], false, 2)
ON CONFLICT DO NOTHING;

-- Pricing settings
INSERT INTO fiyat_ayarlar (anahtar, deger) VALUES
  ('yillik_indirim', '15'),
  ('indirim_aktif', 'true')
ON CONFLICT (anahtar) DO UPDATE SET deger = EXCLUDED.deger;

-- Packages
INSERT INTO paketler (slug, isim, icon, etiket, kurulum, aylik, one_cikan, sira) VALUES
  ('baslangic', 'Başlangıç', '🌱', 'Yeni başlayan işletmeler için', 5000, 2500, false, 1),
  ('buyume', 'Büyüme', '📈', 'En çok tercih edilen paket', 12000, 4500, true, 2),
  ('pro', 'Pro', '🚀', 'Tam kapsamlı dijital yönetim', 18000, 7500, false, 3)
ON CONFLICT (slug) DO NOTHING;

-- Package features
INSERT INTO paket_ozellikler (paket_id, metin, dahil, sira)
SELECT p.id, o.metin, o.dahil, o.sira
FROM paketler p
JOIN (
  SELECT 'baslangic' AS slug, '5 sayfalık web sitesi' AS metin, true AS dahil, 1 AS sira UNION ALL
  SELECT 'baslangic', 'Randevu formu', true, 2 UNION ALL
  SELECT 'baslangic', 'Mobil uyumlu tasarım', true, 3 UNION ALL
  SELECT 'baslangic', 'SSL + hosting dahil', true, 4 UNION ALL
  SELECT 'baslangic', '2 blog yazısı / ay', true, 5 UNION ALL
  SELECT 'baslangic', 'E-posta bülteni', false, 6 UNION ALL
  SELECT 'baslangic', 'Aylık rapor', false, 7 UNION ALL

  SELECT 'buyume', '8 sayfalık web sitesi', true, 1 UNION ALL
  SELECT 'buyume', 'Online randevu sistemi', true, 2 UNION ALL
  SELECT 'buyume', 'Mobil uyumlu + hızlı', true, 3 UNION ALL
  SELECT 'buyume', 'SSL + hosting dahil', true, 4 UNION ALL
  SELECT 'buyume', '4 blog yazısı / ay', true, 5 UNION ALL
  SELECT 'buyume', 'Aylık performans raporu', true, 6 UNION ALL
  SELECT 'buyume', 'E-posta bülteni', false, 7 UNION ALL

  SELECT 'pro', '12 sayfalık web sitesi', true, 1 UNION ALL
  SELECT 'pro', 'Online randevu + hatırlatma', true, 2 UNION ALL
  SELECT 'pro', 'SEO optimizasyonu', true, 3 UNION ALL
  SELECT 'pro', 'SSL + hosting dahil', true, 4 UNION ALL
  SELECT 'pro', '8 blog yazısı / ay', true, 5 UNION ALL
  SELECT 'pro', 'Aylık detaylı rapor', true, 6 UNION ALL
  SELECT 'pro', 'Aylık e-posta bülteni', true, 7
) o ON p.slug = o.slug;

-- Add-ons
INSERT INTO eklentiler (slug, isim, icon, aciklama, fiyat, birim, sira) VALUES
  ('whatsapp', 'WhatsApp Chatbot', '💬', 'Otomatik soru cevaplama, randevu yönlendirme', 500, '/ay', 1),
  ('gads', 'Google Ads Yönetimi', '🎯', 'Reklam bütçesinin %15i — min. ücret dahil', 1000, '/ay min.', 2),
  ('hasta_panel', 'Hasta Yönetim Paneli', '🗂️', 'Kayıt, takip, diyet notu, randevu geçmişi', 3500, 'tek seferlik', 3),
  ('seo', 'Aylık SEO Paketi', '📊', 'Anahtar kelime raporu + içerik optimizasyonu', 2000, '/ay', 4),
  ('email', 'E-posta Bülteni', '✉️', 'Aylık hasta bülteni tasarım + gönderim', 800, '/ay', 5),
  ('cokdil', 'Çok Dil Desteği', '🌍', 'İngilizce / Arapça tam site çevirisi + SEO', 4000, 'tek seferlik', 6)
ON CONFLICT (slug) DO NOTHING;

-- ==================== ROW LEVEL SECURITY ====================
-- Enable RLS - public can only READ, writes require service role key (admin panel)

ALTER TABLE projeler ENABLE ROW LEVEL SECURITY;
ALTER TABLE hizmetler ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_ayarlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE paketler ENABLE ROW LEVEL SECURITY;
ALTER TABLE paket_ozellikler ENABLE ROW LEVEL SECURITY;
ALTER TABLE eklentiler ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiyat_ayarlar ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "public_read_projeler" ON projeler FOR SELECT USING (true);
CREATE POLICY "public_read_hizmetler" ON hizmetler FOR SELECT USING (true);
CREATE POLICY "public_read_site_ayarlar" ON site_ayarlar FOR SELECT USING (true);
CREATE POLICY "public_read_paketler" ON paketler FOR SELECT USING (true);
CREATE POLICY "public_read_paket_ozellikler" ON paket_ozellikler FOR SELECT USING (true);
CREATE POLICY "public_read_eklentiler" ON eklentiler FOR SELECT USING (true);
CREATE POLICY "public_read_fiyat_ayarlar" ON fiyat_ayarlar FOR SELECT USING (true);
