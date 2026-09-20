import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  url: z.string().url().optional().or(z.literal("")),
  image: z.string().optional(),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz veri.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { url, image, ...rest } = parsed.data;
  const item = await prisma.workItem.update({
    where: { id },
    data: {
      ...rest,
      ...(url !== undefined ? { url: url || null } : {}),
      ...(image !== undefined ? { image: image || null } : {}),
    },
  });
  revalidatePath("/", "layout");

  return NextResponse.json(item);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  await prisma.workItem.delete({ where: { id } });
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
