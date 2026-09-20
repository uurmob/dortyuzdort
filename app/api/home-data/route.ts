import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

export async function GET() {
  try {
    const supabase = await createClient()
    const [
      { data: hizmetler },
      { data: projeler },
      { data: siteAyarlarRaw },
    ] = await Promise.all([
      supabase.from('hizmetler').select('*').eq('aktif', true).order('sira'),
      supabase.from('projeler').select('*').eq('aktif', true).order('sira'),
      supabase.from('site_ayarlar').select('*'),
    ])

    const siteAyarlar: Record<string, string> = {}
    ;(siteAyarlarRaw ?? []).forEach((r: { anahtar: string; deger: string }) => {
      siteAyarlar[r.anahtar] = r.deger
    })

    return NextResponse.json({ hizmetler, projeler, siteAyarlar })
  } catch {
    return NextResponse.json({ hizmetler: null, projeler: null, siteAyarlar: {} })
  }
}
