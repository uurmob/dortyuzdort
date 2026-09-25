import { Code2, Bot, Compass, Layers, Zap, ArrowUpRight } from "lucide-react";
import type { Service } from "@prisma/client";
import { Reveal } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { SectionLabel } from "@/components/SectionLabel";

const ICONS = [Code2, Bot, Compass, Layers, Zap];

function spanFor(index: number, total: number) {
  if (total === 3) return index < 2 ? "span-2" : "span-4";
  return "";
}

export function Services({ services }: { services: Service[] }) {
  return (
    <section id="hizmetler" className="section">
      <div className="container-page">
        <Reveal className="max-w-xl">
          <SectionLabel index="01">HİZMETLER</SectionLabel>
          <h2 className="mt-4 text-[clamp(2rem,4vw,2.75rem)] leading-[1.15] font-bold">
            Tasarımdan otomasyona, uçtan uca.
          </h2>
        </Reveal>

        <div className="grid-bento mt-14">
          {services.map((service, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={service.id} className={spanFor(i, services.length)}>
                <SpotlightCard className="h-full">
                  <Icon
                    className="h-8 w-8 text-[var(--accent)]"
                    strokeWidth={1.5}
                  />
                  <h3 className="mt-6 flex items-center gap-2 text-xl">
                    {service.title}
                    <ArrowUpRight className="h-4 w-4 text-[var(--text-tertiary)]" />
                  </h3>
                  <p className="mt-3 text-[0.9375rem]">{service.description}</p>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
