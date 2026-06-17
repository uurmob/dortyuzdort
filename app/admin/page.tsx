import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { adminLogin } from '@/app/actions/admin'
import { createClient } from '@/lib/supabase/server'
import AdminPanel from './AdminPanel'

async function getInitialData() {
  try {
    const supabase = await createClient()
    const [
      { data: projeler },
      { data: hizmetler },
      { data: siteAyarlar },
      { data: paketler },
      { data: eklentiler },
      { data: fiyatAyarlar },
    ] = await Promise.all([
      supabase.from('projeler').select('*').order('sira'),
      supabase.from('hizmetler').select('*').order('sira'),
      supabase.from('site_ayarlar').select('*'),
      supabase.from('paketler').select('*, paket_ozellikler(id,metin,dahil,sira)').order('sira'),
      supabase.from('eklentiler').select('*').order('sira'),
      supabase.from('fiyat_ayarlar').select('*'),
    ])
    return { projeler, hizmetler, siteAyarlar, paketler, eklentiler, fiyatAyarlar }
  } catch {
    return { projeler: [], hizmetler: [], siteAyarlar: [], paketler: [], eklentiler: [], fiyatAyarlar: [] }
  }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const cookieStore = await cookies()
  const isAuth = cookieStore.get('admin_session')?.value === 'authenticated'

  if (!isAuth) {
    const { error } = await searchParams
    return <LoginPage error={error} />
  }

  const data = await getInitialData()
  return <AdminPanel {...data} />
}

function LoginPage({ error }: { error?: string }) {
  async function login(formData: FormData) {
    'use server'
    const password = formData.get('password') as string
    const result = await adminLogin(password)
    if (result.success) redirect('/admin')
    else redirect('/admin?error=1')
  }

  return (
    <main style={{ background: '#0A0A0A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '380px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '0.12em', color: '#fff' }}>
            DÖRTYÜZDÖRT<span style={{ color: '#C8F135' }}>.</span>
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '0.4rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Admin Paneli</div>
        </div>
        <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            name="password"
            placeholder="Şifre"
            required
            autoFocus
            style={{
              background: '#111',
              border: `1px solid ${error ? '#c00' : '#222'}`,
              color: '#fff',
              padding: '13px 16px',
              fontSize: '15px',
              borderRadius: '4px',
              fontFamily: 'inherit',
              outline: 'none',
              width: '100%',
            }}
          />
          {error && (
            <div style={{ color: '#f66', fontSize: '13px', textAlign: 'center' }}>
              Hatalı şifre. Tekrar deneyin.
            </div>
          )}
          <button type="submit"
            style={{ background: '#C8F135', color: '#0A0A0A', border: 'none', padding: '14px', fontWeight: 700, fontSize: '14px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
            Giriş Yap
          </button>
        </form>
      </div>
    </main>
  )
}
