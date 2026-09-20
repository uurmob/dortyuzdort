"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import type { DEFAULT_SETTINGS } from "@/lib/settings";

const FIELDS: { key: keyof typeof DEFAULT_SETTINGS; label: string; multiline?: boolean }[] = [
  { key: "hero_eyebrow", label: "Hero üst etiket" },
  { key: "hero_title", label: "Hero başlık (vurgulu, ilk satır)" },
  { key: "hero_title_secondary", label: "Hero başlık (ikinci satır)" },
  { key: "hero_paragraph", label: "Hero açıklama paragrafı", multiline: true },
  { key: "hero_pillars", label: "Hero etiketleri (virgülle ayır)" },
  { key: "contact_email", label: "İletişim e-postası" },
];

export function GenelForm({ initial }: { initial: typeof DEFAULT_SETTINGS }) {
  const router = useRouter();
  const [values, setValues] = useState<typeof DEFAULT_SETTINGS>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const res = await fetch("/api/yonet/genel", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setSaving(false);
    if (!res.ok) {
      setError("Kaydedilemedi, tekrar dene.");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      {FIELDS.map((field) => (
        <div key={field.key}>
          <label className="text-sm text-[var(--text-secondary)]">
            {field.label}
          </label>
          {field.multiline ? (
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2.5 text-sm outline-none focus-visible:border-[var(--accent)]"
              value={values[field.key]}
              onChange={(e) =>
                setValues((v) => ({ ...v, [field.key]: e.target.value }))
              }
            />
          ) : (
            <input
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2.5 text-sm outline-none focus-visible:border-[var(--accent)]"
              value={values[field.key]}
              onChange={(e) =>
                setValues((v) => ({ ...v, [field.key]: e.target.value }))
              }
            />
          )}
        </div>
      ))}

      {error && <p className="text-sm text-[var(--error)]">{error}</p>}

      <button type="submit" disabled={saving} className="btn btn-primary">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        {saved && !saving && <Check className="h-4 w-4" />}
        Kaydet
      </button>
    </form>
  );
}
