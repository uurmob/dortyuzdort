import { prisma } from "@/lib/prisma";
import { IslerManager } from "./IslerManager";

export default async function IslerPage() {
  const items = await prisma.workItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">İşler</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Tamamlanan projeleri buraya ekledikçe ana sayfadaki &quot;Yakında&quot;
        yer tutucularının yerini alır.
      </p>
      <IslerManager initialItems={items} />
    </div>
  );
}
