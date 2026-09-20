"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, Check, ImagePlus } from "lucide-react";
import type { WorkItem } from "@prisma/client";

export function IslerManager({ initialItems }: { initialItems: WorkItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  function updateLocal(id: string, patch: Partial<WorkItem>) {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  async function saveItem(item: WorkItem) {
    setBusyId(item.id);
    setSavedId(null);
    await fetch(`/api/yonet/isler/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: item.title,
        description: item.description,
        url: item.url ?? "",
        image: item.image ?? "",
        order: item.order,
        published: item.published,
      }),
    });
    setBusyId(null);
    setSavedId(item.id);
    router.refresh();
  }

  async function deleteItem(id: string) {
    if (!confirm("Bu işi silmek istediğine emin misin?")) return;
    setBusyId(id);
    await fetch(`/api/yonet/isler/${id}`, { method: "DELETE" });
    setItems((list) => list.filter((i) => i.id !== id));
    setBusyId(null);
    router.refresh();
  }

  async function addItem() {
    setCreating(true);
    const res = await fetch("/api/yonet/isler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Yeni proje",
        description: "Açıklama ekle...",
        url: "",
        order: items.length,
        published: true,
      }),
    });
    const created = (await res.json()) as WorkItem;
    setItems((list) => [...list, created]);
    setCreating(false);
    router.refresh();
  }

  async function handleImagePick(item: WorkItem, file: File) {
    setUploadingId(item.id);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/yonet/upload", {
      method: "POST",
      body: formData,
    });
    setUploadingId(null);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      alert(body?.error || "Görsel yüklenemedi.");
      return;
    }

    const { url } = (await res.json()) as { url: string };
    updateLocal(item.id, { image: url });
  }

  return (
    <div className="mt-6 space-y-4">
      {items.map((item) => (
        <div key={item.id} className="card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <input
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2 text-sm font-semibold outline-none focus-visible:border-[var(--accent)]"
                value={item.title}
                onChange={(e) => updateLocal(item.id, { title: e.target.value })}
              />
              <textarea
                rows={2}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2 text-sm outline-none focus-visible:border-[var(--accent)]"
                value={item.description}
                onChange={(e) =>
                  updateLocal(item.id, { description: e.target.value })
                }
              />
              <input
                placeholder="https://... (opsiyonel proje linki)"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2 text-sm outline-none focus-visible:border-[var(--accent)]"
                value={item.url ?? ""}
                onChange={(e) => updateLocal(item.id, { url: e.target.value })}
              />

              <div className="flex items-center gap-3">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt=""
                    className="h-14 w-20 rounded-md border border-[var(--border)] object-cover"
                  />
                )}
                <input
                  ref={(el) => {
                    fileInputs.current[item.id] = el;
                  }}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImagePick(item, file);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputs.current[item.id]?.click()}
                  disabled={uploadingId === item.id}
                  className="btn btn-ghost text-xs"
                >
                  {uploadingId === item.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ImagePlus className="h-3.5 w-3.5" />
                  )}
                  {item.image ? "Görseli Değiştir" : "Ekran Görüntüsü Ekle"}
                </button>
              </div>

              <label className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                <input
                  type="checkbox"
                  checked={item.published}
                  onChange={(e) =>
                    updateLocal(item.id, { published: e.target.checked })
                  }
                />
                Sitede yayınla
              </label>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => deleteItem(item.id)}
                disabled={busyId === item.id}
                className="btn btn-ghost !p-2"
                aria-label="Sil"
              >
                {busyId === item.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => saveItem(item)}
                disabled={busyId === item.id}
                className="btn btn-primary text-xs"
              >
                {busyId === item.id && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                {savedId === item.id && busyId !== item.id && (
                  <Check className="h-3.5 w-3.5" />
                )}
                Kaydet
              </button>
            </div>
          </div>
        </div>
      ))}

      <button onClick={addItem} disabled={creating} className="btn btn-ghost">
        {creating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Proje Ekle
      </button>
    </div>
  );
}
