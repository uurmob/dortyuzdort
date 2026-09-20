import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const DEFAULT_SETTINGS = {
  hero_eyebrow: "Web Tasarım & AI Otomasyon Ajansı",
  hero_title: "404 vermeyin.",
  hero_title_secondary: "Markanızı bulunur kılalım.",
  hero_paragraph:
    "dörtyüzdört; web tasarımı ve yapay zekâ destekli otomasyonu bir araya getirerek işletmenizin dijitalde hem göze hem de operasyona hitap etmesini sağlar.",
  hero_pillars: "Özel Tasarım, AI Destekli Otomasyon, Hızlı Teslim",
  contact_email: "merhaba@dortyuzdort.com",
} as const;

export type SettingsMap = Record<string, string>;

export const getSettings = cache(async (): Promise<SettingsMap> => {
  try {
    const rows = await prisma.siteSettings.findMany();
    return rows.reduce<SettingsMap>((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  } catch {
    return {};
  }
});

export function getSetting(
  settings: SettingsMap,
  key: keyof typeof DEFAULT_SETTINGS,
): string {
  return settings[key] || DEFAULT_SETTINGS[key];
}

export function getPillars(settings: SettingsMap): string[] {
  return getSetting(settings, "hero_pillars")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
