'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import './globals.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

export default function Home() {
  const canvasRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/home-data').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  const services = data?.hizmetler ?? [
    { id: 1, icon: '⬡', baslik: 'Web Tasarım', aciklama: 'Modern, hızlı ve dönüşüm odaklı web siteleri. Her proje özgün tasarım anlayışıyla hayata geçirilir.' },
    { id: 2, icon: '◈', baslik: 'SEO', aciklama: "Google'da üst sıralara çıkın. Teknik SEO, içerik stratejisi ve rakip analiziyle organik büyüme." },
    { id: 3, icon: '▣', baslik: 'Hosting', aciklama: 'Güvenli, hızlı ve kesintisiz altyapı. Verileriniz her gece yedeklenir, 7/24 izleme.' },
    { id: 4, icon: '⬘', baslik: 'Dashboard', aciklama: "Klinik, ajans veya işletmenize özel yönetim panelleri. Excel'e veda edin." },
  ];

  const projeler = data?.projeler ?? [
    { id: 1, isim: 'Selen Şenman', aciklama: 'Diyetisyen Web Sitesi', url: 'www.selensenman.com', teknolojiler: ['PHP', 'MySQL', 'Admin Panel'], one_cikan: true },
    { id: 2, isim: 'Hastane Dashboard', aciklama: 'Klinik Yönetim Sistemi', url: null, teknolojiler: ['Next.js', 'Supabase', 'Dashboard'], one_cikan: false },
  ];

  const ayarlar = data?.siteAyarlar ?? {};
  const freelanceAcik = ayarlar['freelance_acik'] !== 'false';
  const hakkindaMetin = ayarlar['hakkinda_metin'] ?? 'Gündüzleri sistem destek şefi olarak çalışıyor, geceleri ise Next.js, yapay zeka ve web teknolojileriyle projeler geliştiriyorum.';

  const stats = [
    { value: parseInt(ayarlar['istatistik_proje'] ?? '12', 10), label: 'Tamamlanan Proje' },
    { value: parseInt(ayarlar['istatistik_musteri'] ?? '8', 10), label: 'Mutlu Müşteri' },
    { value: parseInt(ayarlar['istatistik_deneyim'] ?? '3', 10), label: 'Yıllık Deneyim' },
    { value: parseInt(ayarlar['istatistik_uptime'] ?? '99', 10), label: '% Uptime' },
  ];

  const navLinks = [
    { label: 'Hizmetler', href: '#hizmetler' },
    { label: 'Projeler', href: '#projeler' },
    { label: 'Paketler', href: '/paketler', external: false },
    { label: 'Hakkında', href: '#hakkında' },
    { label: 'İletişim', href: '#iletişim' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    for (let i = 0; i < 70; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, size: Math.random() * 1.5 + 0.5 });
    }
    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,241,53,0.2)'; ctx.fill();
      });
      particles.forEach((a, i) => particles.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y, dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 100) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = `rgba(200,241,53,${0.06*(1-dist/100)})`; ctx.lineWidth = 0.5; ctx.stroke(); }
      }));
      animId = requestAnimationFrame(animate);
    };
    animate();
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize); };
  }, []);

  return (
    <main style={{ background: '#0A0A0A', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif', overflowX: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }} />

      <nav className="nav-container" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 3rem', borderBottom: '1px solid #1a1a1a', background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)' }}>
        <div style={{ fontWeight: 700, letterSpacing: '0.12em', fontSize: '15px', color: '#fff' }}>
          DÖRTYÜZDÖRT<span style={{ color: '#C8F135' }}>.</span>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: '2rem', fontSize: '13px' }}>
          {navLinks.map(item => (
            item.href.startsWith('#') ? (
              <a key={item.label} href={item.href} style={{ color: '#bbb', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#C8F135'}
                onMouseLeave={e => e.target.style.color = '#999'}>{item.label}</a>
            ) : (
              <Link key={item.label} href={item.href} style={{ color: '#bbb', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#C8F135'}
                onMouseLeave={e => e.currentTarget.style.color = '#999'}>{item.label}</Link>
            )
          ))}
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <span style={{ width: '22px', height: '1.5px', background: menuOpen ? '#C8F135' : '#fff', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
          <span style={{ width: '22px', height: '1.5px', background: '#fff', display: 'block', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.3s' }} />
          <span style={{ width: '22px', height: '1.5px', background: menuOpen ? '#C8F135' : '#fff', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu" style={{ position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 99, background: 'rgba(10,10,10,0.98)', borderBottom: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '1.5rem' }}>
          {navLinks.map(item => (
            item.href.startsWith('#') ? (
              <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
                style={{ color: '#ccc', textDecoration: 'none', fontSize: '16px' }}>{item.label}</a>
            ) : (
              <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
                style={{ color: '#ccc', textDecoration: 'none', fontSize: '16px' }}>{item.label}</Link>
            )
          ))}
        </div>
      )}

      {/* HERO */}
      <section className="hero-section" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8rem 3rem 4rem' }}>
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp} style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#C8F135', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            ✦ Dijital Ajans — İstanbul
          </motion.div>
          <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2.2rem, 7vw, 5.5rem)', fontWeight: 500, lineHeight: 1.05, maxWidth: '800px', margin: 0, color: '#fff' }}>
            Dijitalde{' '}<span style={{ color: '#C8F135' }}>güçlü</span><br />bir varlık kurun.
          </motion.h1>
          <motion.p variants={fadeUp} style={{ color: '#ccc', fontSize: '16px', lineHeight: 1.8, maxWidth: '500px', marginTop: '1.5rem' }}>
            Web tasarım, SEO ve hosting hizmetleriyle markanızı öne çıkarıyoruz. Doktor kliniklerinden ajans sitelerine kadar her ölçekte dijital çözüm.
          </motion.p>
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', marginTop: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#iletişim" style={{ background: '#C8F135', color: '#0A0A0A', padding: '13px 28px', fontWeight: 600, fontSize: '14px', textDecoration: 'none', borderRadius: '4px' }}>
              Projeyi Başlat →
            </a>
            <Link href="/paketler" style={{ color: '#ccc', fontSize: '14px', textDecoration: 'none', borderBottom: '1px solid #444', paddingBottom: '2px' }}>
              Fiyatları Gör
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <section style={{ position: 'relative', zIndex: 1, padding: '2.5rem 3rem', borderTop: '1px solid #141414', borderBottom: '1px solid #141414' }}>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {stats.map(s => <CountUp key={s.label} value={s.value} label={s.label} />)}
        </div>
      </section>

      {/* HİZMETLER */}
      <section id="hizmetler" className="section-padding" style={{ position: 'relative', zIndex: 1, padding: '6rem 3rem' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#C8F135', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Hizmetler</motion.div>
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)', fontWeight: 500, marginBottom: '2.5rem', color: '#fff' }}>Ne yapıyoruz?</motion.h2>
          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', background: '#1a1a1a', border: '1px solid #1a1a1a' }}>
            {services.map(s => <ServiceCard key={s.id ?? s.baslik} icon={s.icon} title={s.baslik} desc={s.aciklama} />)}
          </div>
        </motion.div>
      </section>

      {/* PROJELER */}
      <section id="projeler" className="section-padding" style={{ position: 'relative', zIndex: 1, padding: '6rem 3rem', borderTop: '1px solid #141414' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#C8F135', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Projeler</motion.div>
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)', fontWeight: 500, marginBottom: '2.5rem', color: '#fff' }}>Referanslar</motion.h2>
          <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {projeler.map(p => (
              <motion.div key={p.id} variants={fadeUp}>
                <ProjectCard
                  title={p.isim}
                  category={p.aciklama}
                  url={p.url ?? 'Yakında'}
                  tags={p.teknolojiler ?? []}
                  soon={!p.url}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* HAKKINDA */}
      <section id="hakkında" className="section-padding about-grid" style={{ position: 'relative', zIndex: 1, padding: '6rem 3rem', borderTop: '1px solid #141414' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#C8F135', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Hakkında</motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            <motion.div variants={fadeUp}>
              <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)', fontWeight: 500, marginBottom: '1.5rem', color: '#fff' }}>Merhaba, ben <span style={{ color: '#C8F135' }}>Uğur</span>.</h2>
              <p style={{ color: '#ccc', fontSize: '15px', lineHeight: 1.9, marginBottom: '1rem' }}>
                {hakkindaMetin}
              </p>
              <p style={{ color: '#ccc', fontSize: '15px', lineHeight: 1.9, marginBottom: '2rem' }}>
                DörtYüzDört, bu iki dünyanın kesişiminde doğdu — teknik altyapıyı iyi bilen biri olarak, müşterilerimin dijital sorunlarına gerçekten çalışan çözümler üretiyorum.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="https://instagram.com/ugurkiyak_" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#bbb', textDecoration: 'none', fontSize: '13px', border: '1px solid #222', padding: '8px 16px', borderRadius: '4px', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8F135'; e.currentTarget.style.color = '#C8F135'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#bbb'; }}>
                  Instagram
                </a>
                <a href="https://linkedin.com/in/ugurkiyak" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#bbb', textDecoration: 'none', fontSize: '13px', border: '1px solid #222', padding: '8px 16px', borderRadius: '4px', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8F135'; e.currentTarget.style.color = '#C8F135'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#bbb'; }}>
                  LinkedIn
                </a>
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <div className="about-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'Uzmanlık', value: 'Sistem & Altyapı' },
                  { label: 'Hobi', value: 'Next.js & AI' },
                  { label: 'Konum', value: 'İstanbul' },
                  { label: 'Durum', value: freelanceAcik ? 'Freelance Açık ✓' : 'Freelance Kapalı' },
                ].map(item => (
                  <div key={item.label} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '4px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '11px', color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{item.label}</div>
                    <div style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* İLETİŞİM */}
      <section id="iletişim" className="section-padding" style={{ position: 'relative', zIndex: 1, padding: '6rem 3rem', borderTop: '1px solid #141414' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#C8F135', textTransform: 'uppercase', marginBottom: '0.75rem' }}>İletişim</motion.div>
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)', fontWeight: 500, marginBottom: '0.75rem', color: '#fff' }}>Projenizi konuşalım.</motion.h2>
          <motion.p variants={fadeUp} style={{ color: '#ccc', marginBottom: '2rem', fontSize: '15px' }}>Fikrinizi anlatın, size en kısa sürede dönelim.</motion.p>
          <motion.div variants={fadeUp}><ContactForm /></motion.div>
        </motion.div>
      </section>

      <footer style={{ position: 'relative', zIndex: 1, padding: '2rem 3rem', borderTop: '1px solid #141414', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.1em', color: '#fff' }}>DÖRTYÜZDÖRT<span style={{ color: '#C8F135' }}>.</span></div>
        <div style={{ fontSize: '12px', color: '#bbb' }}>© 2026 DörtYüzDört. Tüm hakları saklıdır.</div>
      </footer>
    </main>
  );
}

function CountUp({ value, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = Math.ceil(value / 40);
        const timer = setInterval(() => {
          start += step;
          if (start >= value) { setCount(value); clearInterval(timer); } else setCount(start);
        }, 30);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);
  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '1rem 0' }}>
      <div style={{ fontSize: '2.2rem', fontWeight: 500, color: '#C8F135' }}>{count}+</div>
      <div style={{ fontSize: '12px', color: '#bbb', marginTop: '0.25rem' }}>{label}</div>
    </div>
  );
}

function ServiceCard({ icon, title, desc }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? '#111' : '#0A0A0A', padding: '2rem 1.75rem', transition: 'all 0.3s', borderLeft: hovered ? '2px solid #C8F135' : '2px solid transparent' }}>
      <div style={{ fontSize: '1.3rem', marginBottom: '1rem', color: hovered ? '#C8F135' : '#444', transition: 'color 0.3s' }}>{icon}</div>
      <div style={{ fontWeight: 500, fontSize: '15px', marginBottom: '0.6rem', color: '#fff' }}>{title}</div>
      <div style={{ fontSize: '13px', color: '#bbb', lineHeight: 1.7 }}>{desc}</div>
    </div>
  );
}

function ProjectCard({ title, category, url, tags, soon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ border: `1px solid ${hovered ? '#C8F135' : '#222'}`, padding: '1.75rem', borderRadius: '4px', transition: 'border-color 0.3s', background: hovered ? '#0d0d0d' : 'transparent' }}>
      <div style={{ fontSize: '11px', color: '#bbb', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{category}</div>
      <div style={{ fontSize: '1.2rem', fontWeight: 500, color: '#fff', marginBottom: '0.4rem' }}>{title}</div>
      <div style={{ fontSize: '12px', color: soon ? '#444' : '#C8F135', marginBottom: '1.25rem' }}>{url}</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {(tags ?? []).map(t => <span key={t} style={{ fontSize: '11px', border: '1px solid #2a2a2a', color: '#bbb', padding: '3px 8px', borderRadius: '3px' }}>{t}</span>)}
      </div>
    </div>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) setSent(true);
    } catch (e) {}
    setLoading(false);
  };

  if (sent) return <div style={{ color: '#C8F135', fontSize: '15px' }}>✓ Mesajınız alındı, en kısa sürede dönüyoruz.</div>;

  return (
    <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', maxWidth: '600px' }}>
      <input placeholder="Adınız" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
        style={{ background: '#111', border: '1px solid #222', color: '#fff', padding: '12px 16px', fontSize: '14px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none' }} />
      <input placeholder="E-posta" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
        style={{ background: '#111', border: '1px solid #222', color: '#fff', padding: '12px 16px', fontSize: '14px', borderRadius: '4px', fontFamily: 'inherit', outline: 'none' }} />
      <textarea placeholder="Mesajınız" rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
        style={{ gridColumn: 'span 2', background: '#111', border: '1px solid #222', color: '#fff', padding: '12px 16px', fontSize: '14px', borderRadius: '4px', resize: 'vertical', fontFamily: 'inherit', outline: 'none' }} />
      <button onClick={handleSubmit} disabled={loading}
        style={{ gridColumn: 'span 2', background: '#C8F135', color: '#0A0A0A', border: 'none', padding: '14px', fontWeight: 600, fontSize: '14px', borderRadius: '4px', cursor: 'pointer' }}>
        {loading ? 'Gönderiliyor...' : 'Gönder →'}
      </button>
    </div>
  );
}
