import { Layers, Zap, Target, MessageSquare } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

const POINTS = [
  {
    icon: Layers,
    title: "Uçtan uca ortaklık",
    description: "Tasarımdan otomasyona tek elden, tek noktadan ilerleriz.",
  },
  {
    icon: Zap,
    title: "Hız",
    description: "Modern altyapı, gereksiz karmaşa yok — hızlı teslim.",
  },
  {
    icon: Target,
    title: "Ölçülebilir sonuç",
    description: "Kurduğumuz her otomasyonun net bir amacı ve ölçütü var.",
  },
  {
    icon: MessageSquare,
    title: "Şeffaflık",
    description: "Süreç boyunca net, düzenli ve anlaşılır iletişim.",
  },
];

export function WhyUs() {
  return (
    <section id="yaklasim" className="section bg-[var(--surface-alt)]">
      <div className="container-page">
        <Reveal className="max-w-xl">
          <SectionLabel index="02">YAKLAŞIMIMIZ</SectionLabel>
          <h2 className="mt-4 text-[clamp(2rem,4vw,2.75rem)] leading-[1.15] font-bold">
            Neden dörtyüzdört?
          </h2>
        </Reveal>

        <Reveal stagger className="grid-bento mt-14">
          {POINTS.map((point) => (
            <div key={point.title} className="card">
              <point.icon
                className="h-7 w-7 text-[var(--accent)]"
                strokeWidth={1.5}
              />
              <h3 className="mt-5 text-lg">{point.title}</h3>
              <p className="mt-2 text-[0.9375rem]">{point.description}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
