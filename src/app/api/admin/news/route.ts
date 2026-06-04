import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  deleteStorageObjects,
  uploadNewsCover,
} from "@/lib/supabase-admin";

const newsPayloadSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi."),
  slug: z.string().trim().min(1, "Slug wajib diisi."),
  excerpt: z.string().trim().min(1, "Ringkasan wajib diisi."),
  content: z.object({ type: z.string() }).passthrough(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  categoryId: z.string().trim().nullable(),
});

function parseOptionalText(value: FormDataEntryValue | null) {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized || null;
}

function parseCoverFile(formData: FormData) {
  const file = formData.get("coverImage");

  if (!(file instanceof File) || file.size === 0) {
    return { file: null };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "File cover harus berupa gambar." };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { error: "Ukuran maksimal cover adalah 10MB." };
  }

  return { file };
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const contentValue = formData.get("content");
    const parsedContent =
      typeof contentValue === "string" && contentValue.trim()
        ? JSON.parse(contentValue)
        : null;

    const parsed = newsPayloadSchema.safeParse({
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt"),
      content: parsedContent,
      status: formData.get("status"),
      categoryId: parseOptionalText(formData.get("categoryId")),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Payload tidak valid." },
        { status: 400 }
      );
    }

    const parsedCover = parseCoverFile(formData);
    if ("error" in parsedCover) {
      return NextResponse.json({ error: parsedCover.error }, { status: 400 });
    }

    const data = parsed.data;

    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: data.categoryId,
          type: "NEWS",
        },
        select: { id: true },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Kategori berita tidak valid." },
          { status: 400 }
        );
      }
    }

    const created = await prisma.news.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content as Prisma.InputJsonValue,
        status: data.status,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        categoryId: data.categoryId,
      },
    });

    let uploadedCover:
      | {
          imageUrl: string;
          storagePath: string;
        }
      | null = null;

    try {
      if (parsedCover.file) {
        uploadedCover = await uploadNewsCover(parsedCover.file, created.id);

        await prisma.news.update({
          where: { id: created.id },
          data: {
            coverUrl: uploadedCover.imageUrl,
          },
        });
      }

      const result = await prisma.news.findUnique({
        where: { id: created.id },
      });

      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      await Promise.allSettled([
        prisma.news.delete({ where: { id: created.id } }),
        deleteStorageObjects(
          uploadedCover ? [uploadedCover.storagePath] : []
        ),
      ]);

      const message =
        error instanceof Error ? error.message : "Gagal membuat berita.";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Slug sudah dipakai berita lain." },
        { status: 409 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Format konten berita tidak valid." },
        { status: 400 }
      );
    }

    console.error("Failed to create news:", error);
    return NextResponse.json(
      { error: "Gagal membuat berita." },
      { status: 500 }
    );
  }
}
