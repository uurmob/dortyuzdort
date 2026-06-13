'use client';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
      });
    }
    particlesRef.current = particles;

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,241,53,0.25)';
        ctx.fill();
      });
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(200,241,53,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const services = [
    { icon: '⬡', title: 'Web Tasarım', desc: 'Modern, hızlı ve dönüşüm odaklı web siteleri. Her proje özgün tasarım anlayışıyla hayata geçirilir.' },
    { icon: '◈', title: 'SEO', desc: 'Google\'da üst sıralara çıkın. Teknik SEO, içerik stratejisi ve rakip analiziyle organik büyüme.' },
    { icon: '▣', title: 'Hosting', desc: 'Güvenli, hızlı ve kesintisiz altyapı. Verileriniz her gece yedeklenir, 7/24 izleme.' },
    { icon: '⬘', title: 'Dashboard', desc: 'Klinik, ajans veya işletmenize özel yönetim panelleri. Excel\'e veda edin.' },
  ];

  const stats = [
    { value: 12, label: 'Tamamlanan Proje' },
    { value: 8, label: 'Mutlu Müşteri' },
    { value: 3, label: 'Yıllık Deneyim' },
    { value: 99, label: '% Uptime Garantisi' },
  ];

  return (
    <main style={{ background: '#0A0A0A', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif', overflowX: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }} />

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 3rem', borderBottom: '1px solid #1a1a1a', background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)' }}>
        <div style={{ fontWeight: 600, letterSpacing: '0.12em', fontSize: '15px' }}>
          DÖRTYÜZDÖRT<span style={{ color: '#C8F135' }}>.</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '13px', color: '#666' }}>
          {['Hizmetler', 'Projeler', 'Hakkında', 'İletişim'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: '#666', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#C8F135'}
              onMouseLeave={e => e.target.style.color = '#666'}>
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8rem 3rem 4rem' }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#C8F135', textTransform: 'uppercase', marginBottom: '1.5rem', opacity: 0.8 }}>
          ✦ Dijital Ajans — İstanbul
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 500, lineHeight: 1.05, maxWidth: '800px', margin: 0 }}>
          Dijitalde{' '}
          <span style={{ color: '#C8F135', position: 'relative' }}>güçlü</span>
          <br />bir varlık kurun.
        </h1>
        <p style={{ color: '#555', fontSize: '16px', lineHeight: 1.8, maxWidth: '500px', marginTop: '2rem' }}>
          Web tasarım, SEO ve hosting hizmetleriyle markanızı öne çıkarıyoruz. Doktor kliniklerinden ajans sitelerine kadar her ölçekte dijital çözüm.
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', alignItems: 'center' }}>
          <a href="#iletişim" style={{ background: '#C8F135', color: '#0A0A0A', padding: '14px 32px', fontWeight: 600, fontSize: '14px', textDecoration: 'none', borderRadius: '4px', letterSpacing: '0.02em', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            Projeyi Başlat →
          </a>
          <a href="#projeler" style={{ color: '#555', fontSize: '14px', textDecoration: 'none', borderBottom: '1px solid #333', paddingBottom: '2px' }}
            onMouseEnter={e => { e.target.style.color = '#fff'; e.target.style.borderColor = '#555'; }}
            onMouseLeave={e => { e.target.style.color = '#555'; e.target.style.borderColor = '#333'; }}>
            Projeleri Gör
          </a>
        </div>

        {/* SCROLL INDICATOR */}
        <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '1px', background: '#333' }} />
          <span style={{ fontSize: '11px', color: '#444', letterSpacing: '0.15em' }}>SCROLL</span>
        </div>
      </section>

      {/* STATS */}
      <section style={{ position: 'relative', zIndex: 1, padding: '3rem', borderTop: '1px solid #141414', borderBottom: '1px solid #141414' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          {stats.map((s) => (
            <CountUp key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </section>

      {/* HİZMETLER */}
      <section id="hizmetler" style={{ position: 'relative', zIndex: 1, padding: '6rem 3rem' }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#C8F135', textTransform: 'uppercase', marginBottom: '1rem' }}>Hizmetler</div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 500, marginBottom: '3rem', color: '#fff' }}>Ne yapıyoruz?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', border: '1px solid #1a1a1a', background: '#1a1a1a' }}>
          {services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
      </section>

      {/* PROJELER */}
      <section id="projeler" style={{ position: 'relative', zIndex: 1, padding: '6rem 3rem', borderTop: '1px solid #141414' }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#C8F135', textTransform: 'uppercase', marginBottom: '1rem' }}>Projeler</div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 500, marginBottom: '3rem', color: '#fff' }}>Referanslar</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <ProjectCard
            title="Selen Şenman"
            category="Diyetisyen Web Sitesi"
            url="www.selensenman.com"
            tags={['PHP', 'MySQL', 'Admin Panel']}
          />
          <ProjectCard
            title="Hastane Dashboard"
            category="Klinik Yönetim Sistemi"
            url="Yakında"
            tags={['Next.js', 'Supabase', 'Dashboard']}
            soon
          />
        </div>
      </section>

      {/* İLETİŞİM */}
      <section id="iletişim" style={{ position: 'relative', zIndex: 1, padding: '6rem 3rem', borderTop: '1px solid #141414' }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#C8F135', textTransform: 'uppercase', marginBottom: '1rem' }}>İletişim</div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 500, marginBottom: '1rem', color: '#fff' }}>Projenizi konuşalım.</h2>
        <p style={{ color: '#555', marginBottom: '2.5rem', fontSize: '15px' }}>Fikrinizi anlatın, size en kısa sürede dönelim.</p>
        <ContactForm />
      </section>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 1, padding: '2rem 3rem', borderTop: '1px solid #141414', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.1em' }}>DÖRTYÜZDÖRT<span style={{ color: '#C8F135' }}>.</span></div>
        <div style={{ fontSize: '12px', color: '#444' }}>© 2026 DörtYüzDört. Tüm hakları saklıdır.</div>
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
          if (start >= value) { setCount(value); clearInterval(timer); }
          else setCount(start);
        }, 30);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);
  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ fontSize: '2.5rem', fontWeight: 500, color: '#C8F135' }}>{count}+</div>
      <div style={{ fontSize: '12px', color: '#555', marginTop: '0.25rem', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}

function ServiceCard({ icon, title, desc }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? '#111' : '#0A0A0A', padding: '2.5rem 2rem', transition: 'background 0.3s', cursor: 'default', borderLeft: hovered ? '2px solid #C8F135' : '2px solid transparent' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '1rem', color: hovered ? '#C8F135' : '#333', transition: 'color 0.3s' }}>{icon}</div>
      <div style={{ fontWeight: 500, fontSize: '15px', marginBottom: '0.75rem', color: '#fff' }}>{title}</div>
      <div style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>{desc}</div>
    </div>
  );
}

function ProjectCard({ title, category, url, tags, soon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ border: `1px solid ${hovered ? '#C8F135' : '#1a1a1a'}`, padding: '2rem', borderRadius: '4px', transition: 'border-color 0.3s', background: hovered ? '#0d0d0d' : 'transparent', cursor: 'pointer' }}>
      <div style={{ fontSize: '11px', color: '#555', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{category}</div>
      <div style={{ fontSize: '1.3rem', fontWeight: 500, color: '#fff', marginBottom: '0.5rem' }}>{title}</div>
      <div style={{ fontSize: '12px', color: soon ? '#444' : '#C8F135', marginBottom: '1.5rem' }}>{url}</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {tags.map(t => (
          <span key={t} style={{ fontSize: '11px', border: '1px solid #222', color: '#555', padding: '3px 8px', borderRadius: '3px' }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  return sent ? (
    <div style={{ color: '#C8F135', fontSize: '15px' }}>✓ Mesajınız alındı, en kısa sürede dönüyoruz.</div>
  ) : (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '600px' }}>
      {[{ placeholder: 'Adınız', colSpan: 1 }, { placeholder: 'E-posta', colSpan: 1 }, { placeholder: 'Mesajınız', colSpan: 2, textarea: true }].map((f) => (
        f.textarea
          ? <textarea key={f.placeholder} placeholder={f.placeholder} rows={4} style={{ gridColumn: `span ${f.colSpan}`, background: '#111', border: '1px solid #1e1e1e', color: '#fff', padding: '12px 16px', fontSize: '14px', borderRadius: '4px', resize: 'vertical', fontFamily: 'inherit' }} />
          : <input key={f.placeholder} placeholder={f.placeholder} style={{ gridColumn: `span ${f.colSpan}`, background: '#111', border: '1px solid #1e1e1e', color: '#fff', padding: '12px 16px', fontSize: '14px', borderRadius: '4px', fontFamily: 'inherit' }} />
      ))}
      <button onClick={() => setSent(true)} style={{ gridColumn: 'span 2', background: '#C8F135', color: '#0A0A0A', border: 'none', padding: '14px', fontWeight: 600, fontSize: '14px', borderRadius: '4px', cursor: 'pointer', letterSpacing: '0.02em' }}>
        Gönder →
      </button>
    </div>
  );
}
