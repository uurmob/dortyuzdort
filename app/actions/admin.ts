'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

// --- AUTH ---
export async function adminLogin(password: string) {
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Hatalı şifre' }
  }
  const cookieStore = await cookies()
  cookieStore.set('admin_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return { success: true }
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}

export async function checkAdminAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

// --- SITE SETTINGS ---
export async function updateSiteAyar(anahtar: string, deger: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('site_ayarlar')
    .upsert({ anahtar, deger })
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

// --- PROJELER ---
export async function upsertProje(data: Record<string, unknown>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('projeler').upsert(data)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteProje(id: number) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('projeler').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

// --- HİZMETLER ---
export async function updateHizmet(id: number, data: Record<string, unknown>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('hizmetler').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

// --- PAKETLER ---
export async function updatePaket(id: number, data: Record<string, unknown>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('paketler').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/paketler')
  revalidatePath('/admin')
  return { success: true }
}

export async function updatePaketOzellikler(
  paketId: number,
  ozellikler: { metin: string; dahil: boolean; sira: number }[]
) {
  const supabase = createAdminClient()
  await supabase.from('paket_ozellikler').delete().eq('paket_id', paketId)
  const rows = ozellikler.map(o => ({ ...o, paket_id: paketId }))
  const { error } = await supabase.from('paket_ozellikler').insert(rows)
  if (error) return { error: error.message }
  revalidatePath('/paketler')
  revalidatePath('/admin')
  return { success: true }
}

// --- EKLENTİLER ---
export async function upsertEklenti(data: Record<string, unknown>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('eklentiler').upsert(data)
  if (error) return { error: error.message }
  revalidatePath('/paketler')
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteEklenti(id: number) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('eklentiler').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/paketler')
  revalidatePath('/admin')
  return { success: true }
}

// --- FİYAT AYARLARI ---
export async function updateFiyatAyar(anahtar: string, deger: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('fiyat_ayarlar').upsert({ anahtar, deger })
  if (error) return { error: error.message }
  revalidatePath('/paketler')
  revalidatePath('/admin')
  return { success: true }
}
