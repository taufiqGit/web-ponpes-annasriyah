import { Prisma, PublishStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { deleteGalleryImages, uploadGalleryImage } from "@/lib/supabase-admin";

const albumInclude = {
  images: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  },
  _count: {
    select: {
      images: true,
    },
  },
} satisfies Prisma.GalleryAlbumInclude;

function parseStatus(value: FormDataEntryValue | null) {
  if (value === "DRAFT" || value === "PUBLISHED") {
    return value;
  }

  return null;
}

function parseOptionalText(value: FormDataEntryValue | null) {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized || null;
}

function parseEventDate(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "invalid" : date;
}

function parseFiles(formData: FormData) {
  const files = formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return { error: "Semua file harus berupa gambar." };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { error: "Ukuran maksimal tiap gambar adalah 10MB." };
    }
  }

  return { files };
}

async function ensureSession() {
  const session = await getServerSession(authOptions);
  return Boolean(session);
}

export async function POST(req: Request) {
  if (!(await ensureSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const title = parseOptionalText(formData.get("title"));
    const description = parseOptionalText(formData.get("description"));
    const status = parseStatus(formData.get("status"));
    const eventDate = parseEventDate(formData.get("eventDate"));
    const parsedFiles = parseFiles(formData);

    if (!title) {
      return NextResponse.json({ message: "Judul album wajib diisi." }, { status: 400 });
    }

    if (!status) {
      return NextResponse.json({ message: "Status album tidak valid." }, { status: 400 });
    }

    if (eventDate === "invalid") {
      return NextResponse.json({ message: "Tanggal album tidak valid." }, { status: 400 });
    }

    if ("error" in parsedFiles) {
      return NextResponse.json({ message: parsedFiles.error }, { status: 400 });
    }

    if (parsedFiles.files.length === 0) {
      return NextResponse.json(
        { message: "Minimal unggah satu gambar untuk membuat album." },
        { status: 400 }
      );
    }

    const album = await prisma.galleryAlbum.create({
      data: {
        title,
        description,
        status,
        publishedAt: status === PublishStatus.PUBLISHED ? new Date() : null,
        eventDate,
      },
    });

    const uploadedImages: Array<{ imageUrl: string; storagePath: string }> = [];

    try {
      for (const file of parsedFiles.files) {
        uploadedImages.push(await uploadGalleryImage(file, album.id));
      }

      await prisma.galleryImage.createMany({
        data: uploadedImages.map((image, index) => ({
          albumId: album.id,
          imageUrl: image.imageUrl,
          storagePath: image.storagePath,
          sortOrder: index,
        })),
      });

      const result = await prisma.galleryAlbum.findUnique({
        where: { id: album.id },
        include: albumInclude,
      });

      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      await Promise.allSettled([
        prisma.galleryAlbum.delete({ where: { id: album.id } }),
        deleteGalleryImages(uploadedImages.map((image) => image.storagePath)),
      ]);

      const message =
        error instanceof Error ? error.message : "Gagal menyimpan album galeri.";

      return NextResponse.json({ message }, { status: 500 });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal memproses permintaan galeri.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
