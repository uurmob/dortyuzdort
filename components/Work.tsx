import { ArrowUpRight } from "lucide-react";
import type { WorkItem } from "@prisma/client";
import { Reveal } from "@/components/Reveal";

export function Work({ items }: { items: WorkItem[] }) {
  return (
    <section id="isler" className="section bg-[var(--surface-alt)]">
      <div className="container-page">
        <Reveal className="max-w-xl">
          <span className="eyebrow">Seçili İşler</span>
          <h2 className="mt-4 text-[clamp(2rem,4vw,2.75rem)] leading-[1.15] font-bold">
            {items.length > 0 ? "Yaptığımız işler" : "Yakında burada"}
          </h2>
          {items.length === 0 && (
            <p className="mt-4 text-[0.9375rem]">
              İlk projelerimiz kısa süre içinde burada yerini alacak. O
              zamana kadar projenizi konuşmaya hazırız.
            </p>
          )}
        </Reveal>

        <Reveal stagger className="grid-3 mt-14">
          {items.length > 0
            ? items.map((item) => {
                const card = (
                  <div className="card h-full !p-0 overflow-hidden">
                    <div className="aspect-video w-full overflow-hidden bg-[var(--surface-hover)]">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{
                            backgroundImage:
                              "linear-gradient(135deg, rgba(0,0,238,0.06), rgba(217,143,217,0.18)), repeating-linear-gradient(45deg, rgba(30,30,30,0.04) 0 2px, transparent 2px 14px)",
                          }}
                        />
                      )}
                    </div>
                    <div className="p-8">
                      <h3 className="flex items-center gap-2 text-lg">
                        {item.title}
                        {item.url && (
                          <ArrowUpRight className="h-4 w-4 text-[var(--text-tertiary)]" />
                        )}
                      </h3>
                      <p className="mt-3 text-[0.9375rem]">{item.description}</p>
                    </div>
                  </div>
                );
                return item.url ? (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    {card}
                  </a>
                ) : (
                  <div key={item.id}>{card}</div>
                );
              })
            : [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="card flex aspect-4/3 items-center justify-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, rgba(0,0,238,0.05), rgba(217,143,217,0.14)), repeating-linear-gradient(45deg, rgba(30,30,30,0.04) 0 2px, transparent 2px 14px)",
                  }}
                >
                  <span className="tag">Yakında</span>
                </div>
              ))}
        </Reveal>
      </div>
    </section>
  );
}
