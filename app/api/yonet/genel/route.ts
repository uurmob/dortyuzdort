import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const schema = z.object({
  hero_eyebrow: z.string().min(1),
  hero_title: z.string().min(1),
  hero_title_secondary: z.string().min(1),
  hero_paragraph: z.string().min(1),
  hero_pillars: z.string().min(1),
  contact_email: z.string().email(),
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz veri.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  await Promise.all(
    Object.entries(parsed.data).map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    ),
  );

  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
