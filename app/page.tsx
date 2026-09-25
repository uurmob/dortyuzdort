import { prisma } from "@/lib/prisma";
import { getSettings, getSetting, getPillars } from "@/lib/settings";
import { SiteNav } from "@/components/SiteNav";
import { Hero } from "@/components/Hero";
import { ServiceMarquee } from "@/components/ServiceMarquee";
import { Services } from "@/components/Services";
import { WhyUs } from "@/components/WhyUs";
import { Process } from "@/components/Process";
import { Work } from "@/components/Work";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { AsciiDivider } from "@/components/AsciiDivider";

// Bu sayfa her istekte Prisma/SQLite'a bağlanır (admin panelinden yapılan
// değişikliklerin anında yansıması için); build container'da DB erişimi
// olmayabileceğinden statik prerender'ı devre dışı bırakıyoruz.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, services, workItems] = await Promise.all([
    getSettings(),
    prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
    prisma.workItem.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <>
      <SiteNav />
      <main>
        <Hero
          eyebrow={getSetting(settings, "hero_eyebrow")}
          titleMain={getSetting(settings, "hero_title")}
          titleSecondary={getSetting(settings, "hero_title_secondary")}
          paragraph={getSetting(settings, "hero_paragraph")}
          pillars={getPillars(settings)}
        />
        <ServiceMarquee />
        <Services services={services} />
        <AsciiDivider />
        <WhyUs />
        <Process />
        <AsciiDivider />
        <Work items={workItems} />
        <Contact email={getSetting(settings, "contact_email")} />
      </main>
      <Footer />
    </>
  );
}
