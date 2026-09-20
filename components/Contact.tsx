import { Mail, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export function Contact({ email }: { email: string }) {
  return (
    <section id="iletisim" className="section">
      <div className="container-page">
        <Reveal className="card mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">İletişim</span>
          <h2 className="mt-4 text-[clamp(2rem,4vw,2.75rem)] leading-[1.15] font-bold">
            Projenizi konuşalım.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[0.9375rem]">
            Web tasarım veya AI otomasyon ihtiyacınızı anlatın, size en uygun
            yol haritasını birlikte çıkaralım.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href={`mailto:${email}`} className="btn btn-primary">
              <Mail className="h-4 w-4" />
              Bize Yazın
              <ArrowRight className="h-4 w-4" />
            </a>
            <span className="link pointer-events-none text-sm">{email}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
