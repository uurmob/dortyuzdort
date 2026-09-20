import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url().optional().or(z.literal("")),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export async function GET() {
  const items = await prisma.workItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz veri.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { url, ...rest } = parsed.data;
  const item = await prisma.workItem.create({
    data: { ...rest, url: url || null },
  });
  revalidatePath("/", "layout");

  return NextResponse.json(item, { status: 201 });
}
