import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULT_SETTINGS } from "../lib/settings";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@dortyuzdort.com";
  const password = process.env.ADMIN_PASSWORD || "dortyuzdort2026";

  if (!process.env.ADMIN_PASSWORD) {
    console.warn(
      "[seed] ADMIN_PASSWORD env değişkeni yok, varsayılan şifre kullanılıyor. " +
        "İlk girişten sonra mutlaka değiştir.",
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashed,
      name: "dörtyüzdört",
    },
  });

  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await prisma.siteSettings.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }

  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: [
        {
          title: "Web Tasarım & Geliştirme",
          description:
            "Modern, hızlı ve dönüşüm odaklı web siteleri ve web uygulamaları tasarlıyor; Next.js gibi güncel teknolojilerle uçtan uca hayata geçiriyoruz.",
          order: 0,
        },
        {
          title: "AI Otomasyon",
          description:
            "Tekrarlayan iş süreçlerinizi yapay zekâ destekli otomasyonlarla hızlandırıyor, ekibinizin zamanını değerli işlere ayırmasını sağlıyoruz.",
          order: 1,
        },
        {
          title: "Süreç Danışmanlığı",
          description:
            "Web ve otomasyon yatırımlarınızın nereden başlayacağını birlikte netleştiriyoruz — doğru önceliklendirme, doğru yol haritası.",
          order: 2,
        },
      ],
    });
  }

  console.log(`[seed] Admin kullanıcı hazır: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
