import { CategoryType, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

type CategoryPayload = {
  name?: string;
  slug?: string;
  type?: string;
};

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseType(value?: string): CategoryType | null {
  if (value === "NEWS" || value === "ACTIVITY" || value === "GALLERY") {
    return value;
  }

  return null;
}

function validatePayload(payload: CategoryPayload) {
  const name = payload.name?.trim();
  const slug = payload.slug ? normalizeSlug(payload.slug) : "";
  const type = parseType(payload.type);

  if (!name) {
    return { error: "Nama kategori wajib diisi." };
  }

  if (!slug) {
    return { error: "Slug kategori wajib diisi." };
  }

  if (!type) {
    return { error: "Tipe kategori tidak valid." };
  }

  return {
    name,
    slug,
    type,
  };
}

async function ensureSession() {
  const session = await getServerSession(authOptions);
  return Boolean(session);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await ensureSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const payload = (await req.json()) as CategoryPayload;
  const validated = validatePayload(payload);

  if ("error" in validated) {
    return NextResponse.json({ message: validated.error }, { status: 400 });
  }

  const existing = await prisma.category.findFirst({
    where: {
      slug: validated.slug,
      NOT: { id },
    },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ message: "Slug kategori sudah digunakan." }, { status: 409 });
  }

  try {
    const item = await prisma.category.update({
      where: { id },
      data: validated,
      include: {
        _count: {
          select: {
            news: true,
            activities: true,
          },
        },
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ message: "Kategori tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ message: "Gagal memperbarui kategori." }, { status: 500 });
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
  const item = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          news: true,
          activities: true,
        },
      },
    },
  });

  if (!item) {
    return NextResponse.json({ message: "Kategori tidak ditemukan." }, { status: 404 });
  }

  const totalUsed = item._count.news + item._count.activities;
  if (totalUsed > 0) {
    return NextResponse.json(
      { message: "Kategori masih dipakai oleh berita atau kegiatan dan belum bisa dihapus." },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
