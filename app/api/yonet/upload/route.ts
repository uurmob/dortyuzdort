import { NextResponse } from "next/server";
import path from "path";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { UPLOAD_DIR, ensureUploadDir, extensionForMime } from "@/lib/uploads";

const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }

  const extension = extensionForMime(file.type);
  if (!extension) {
    return NextResponse.json(
      { error: "Sadece PNG, JPG, WEBP veya GIF yükleyebilirsin." },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Dosya 5MB'tan büyük olamaz." },
      { status: 400 },
    );
  }

  ensureUploadDir();

  const filename = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { writeFile } = await import("fs/promises");
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return NextResponse.json({ url: `/api/uploads/${filename}` });
}
