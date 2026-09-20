"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { WorkItem } from "@prisma/client";

export function IslerManager({ initialItems }: { initialItems: WorkItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  function updateLocal(id: string, patch: Partial<WorkItem>) {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  async function saveItem(item: WorkItem) {
    setBusyId(item.id);
    await fetch(`/api/yonet/isler/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: item.title,
        description: item.description,
        url: item.url ?? "",
        order: item.order,
        published: item.published,
      }),
    });
    setBusyId(null);
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
                onBlur={() => saveItem(item)}
              />
              <textarea
                rows={2}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2 text-sm outline-none focus-visible:border-[var(--accent)]"
                value={item.description}
                onChange={(e) =>
                  updateLocal(item.id, { description: e.target.value })
                }
                onBlur={() => saveItem(item)}
              />
              <input
                placeholder="https://... (opsiyonel proje linki)"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2 text-sm outline-none focus-visible:border-[var(--accent)]"
                value={item.url ?? ""}
                onChange={(e) => updateLocal(item.id, { url: e.target.value })}
                onBlur={() => saveItem(item)}
              />
              <label className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                <input
                  type="checkbox"
                  checked={item.published}
                  onChange={(e) => {
                    const next = { ...item, published: e.target.checked };
                    updateLocal(item.id, { published: e.target.checked });
                    saveItem(next);
                  }}
                />
                Sitede yayınla
              </label>
            </div>

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
