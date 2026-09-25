import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

const STEPS = [
  {
    n: "01",
    title: "Keşif & Analiz",
    description:
      "İşinizi, hedef kitlenizi ve mevcut süreçlerinizi birlikte çıkarıyoruz.",
  },
  {
    n: "02",
    title: "Tasarım & Prototip",
    description:
      "Marka kimliğinize uygun bir tasarım dili kuruyor, erken aşamada onayınızı alıyoruz.",
  },
  {
    n: "03",
    title: "Geliştirme & Otomasyon",
    description:
      "Web sitenizi geliştiriyor, tekrarlayan işlerinizi otomasyona bağlıyoruz.",
  },
  {
    n: "04",
    title: "Yayın & Optimizasyon",
    description:
      "Canlıya alıyor, performansı izliyor ve sürekli iyileştiriyoruz.",
  },
];

export function Process() {
  return (
    <section id="surec" className="section">
      <div className="container-page">
        <Reveal className="max-w-xl">
          <SectionLabel index="03">SÜREÇ</SectionLabel>
          <h2 className="mt-4 text-[clamp(2rem,4vw,2.75rem)] leading-[1.15] font-bold">
            Nasıl çalışıyoruz
          </h2>
        </Reveal>

        <div className="process-track mt-14">
          <div className="process-connector" aria-hidden>
            <span className="process-connector-dot" />
          </div>
          <Reveal
            stagger
            as="ul"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {STEPS.map((step) => (
              <li key={step.n} className="card">
                <span
                  className="text-3xl font-bold"
                  style={{ color: "var(--accent)" }}
                >
                  {step.n}
                </span>
                <h3 className="mt-4 text-lg">{step.title}</h3>
                <p className="mt-2 text-[0.9375rem]">{step.description}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
