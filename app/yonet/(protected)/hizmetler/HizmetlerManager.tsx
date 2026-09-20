"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { Service } from "@prisma/client";

export function HizmetlerManager({
  initialServices,
}: {
  initialServices: Service[];
}) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  function updateLocal(id: string, patch: Partial<Service>) {
    setServices((list) =>
      list.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );
  }

  async function saveService(service: Service) {
    setBusyId(service.id);
    await fetch(`/api/yonet/hizmetler/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: service.title,
        description: service.description,
        order: service.order,
        published: service.published,
      }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function deleteService(id: string) {
    if (!confirm("Bu hizmeti silmek istediğine emin misin?")) return;
    setBusyId(id);
    await fetch(`/api/yonet/hizmetler/${id}`, { method: "DELETE" });
    setServices((list) => list.filter((s) => s.id !== id));
    setBusyId(null);
    router.refresh();
  }

  async function addService() {
    setCreating(true);
    const res = await fetch("/api/yonet/hizmetler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Yeni hizmet",
        description: "Açıklama ekle...",
        order: services.length,
        published: true,
      }),
    });
    const created = (await res.json()) as Service;
    setServices((list) => [...list, created]);
    setCreating(false);
    router.refresh();
  }

  return (
    <div className="mt-6 space-y-4">
      {services.map((service) => (
        <div key={service.id} className="card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <input
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2 text-sm font-semibold outline-none focus-visible:border-[var(--accent)]"
                value={service.title}
                onChange={(e) =>
                  updateLocal(service.id, { title: e.target.value })
                }
                onBlur={() => saveService(service)}
              />
              <textarea
                rows={2}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2 text-sm outline-none focus-visible:border-[var(--accent)]"
                value={service.description}
                onChange={(e) =>
                  updateLocal(service.id, { description: e.target.value })
                }
                onBlur={() => saveService(service)}
              />
              <label className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                <input
                  type="checkbox"
                  checked={service.published}
                  onChange={(e) => {
                    const next = { ...service, published: e.target.checked };
                    updateLocal(service.id, { published: e.target.checked });
                    saveService(next);
                  }}
                />
                Sitede yayınla
              </label>
            </div>

            <button
              onClick={() => deleteService(service.id)}
              disabled={busyId === service.id}
              className="btn btn-ghost !p-2"
              aria-label="Sil"
            >
              {busyId === service.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addService}
        disabled={creating}
        className="btn btn-ghost"
      >
        {creating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Hizmet Ekle
      </button>
    </div>
  );
}
