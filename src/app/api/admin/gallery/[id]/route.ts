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

function parseRemoveImageIds(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return null;
  }
}

async function ensureSession() {
  const session = await getServerSession(authOptions);
  return Boolean(session);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await ensureSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const item = await prisma.galleryAlbum.findUnique({
    where: { id },
    include: albumInclude,
  });

  if (!item) {
    return NextResponse.json({ message: "Album tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await ensureSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const formData = await req.formData();
    const title = parseOptionalText(formData.get("title"));
    const description = parseOptionalText(formData.get("description"));
    const status = parseStatus(formData.get("status"));
    const eventDate = parseEventDate(formData.get("eventDate"));
    const parsedFiles = parseFiles(formData);
    const removeImageIds = parseRemoveImageIds(formData.get("removeImageIds"));

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

    if (!removeImageIds) {
      return NextResponse.json({ message: "Format gambar yang dihapus tidak valid." }, { status: 400 });
    }

    const album = await prisma.galleryAlbum.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    });

    if (!album) {
      return NextResponse.json({ message: "Album tidak ditemukan." }, { status: 404 });
    }

    const removedImages = album.images.filter((image) => removeImageIds.includes(image.id));
    const finalImageCount = album.images.length - removedImages.length + parsedFiles.files.length;

    if (finalImageCount <= 0) {
      return NextResponse.json(
        { message: "Album harus memiliki minimal satu gambar." },
        { status: 400 }
      );
    }

    const uploadedImages: Array<{ imageUrl: string; storagePath: string }> = [];

    try {
      for (const file of parsedFiles.files) {
        uploadedImages.push(await uploadGalleryImage(file, album.id));
      }

      await prisma.$transaction(async (tx) => {
        await tx.galleryAlbum.update({
          where: { id: album.id },
          data: {
            title,
            description,
            status,
            publishedAt:
              status === PublishStatus.PUBLISHED
                ? album.publishedAt ?? new Date()
                : null,
            eventDate,
          },
        });

        if (removedImages.length > 0) {
          await tx.galleryImage.deleteMany({
            where: {
              id: {
                in: removedImages.map((image) => image.id),
              },
            },
          });
        }

        if (uploadedImages.length > 0) {
          const maxSortOrder = album.images.reduce(
            (highest, image) => Math.max(highest, image.sortOrder),
            -1
          );

          await tx.galleryImage.createMany({
            data: uploadedImages.map((image, index) => ({
              albumId: album.id,
              imageUrl: image.imageUrl,
              storagePath: image.storagePath,
              sortOrder: maxSortOrder + index + 1,
            })),
          });
        }
      });

      await deleteGalleryImages(
        removedImages
          .map((image) => image.storagePath)
          .filter((path): path is string => Boolean(path))
      ).catch(() => undefined);

      const result = await prisma.galleryAlbum.findUnique({
        where: { id: album.id },
        include: albumInclude,
      });

      return NextResponse.json(result);
    } catch (error) {
      await deleteGalleryImages(uploadedImages.map((image) => image.storagePath)).catch(
        () => undefined
      );

      const message =
        error instanceof Error ? error.message : "Gagal memperbarui album galeri.";

      return NextResponse.json({ message }, { status: 500 });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal memproses pembaruan album.";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await ensureSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const album = await prisma.galleryAlbum.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });

  if (!album) {
    return NextResponse.json({ message: "Album tidak ditemukan." }, { status: 404 });
  }

  await prisma.galleryAlbum.delete({ where: { id } });

  await deleteGalleryImages(
    album.images
      .map((image) => image.storagePath)
      .filter((path): path is string => Boolean(path))
  ).catch(() => undefined);

  return NextResponse.json({ success: true });
}
