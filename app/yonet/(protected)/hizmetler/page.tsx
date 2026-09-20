import { prisma } from "@/lib/prisma";
import { HizmetlerManager } from "./HizmetlerManager";

export default async function HizmetlerPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">Hizmetler</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Ana sayfadaki hizmet kartlarını buradan ekleyip düzenleyebilirsin.
      </p>
      <HizmetlerManager initialServices={services} />
    </div>
  );
}
