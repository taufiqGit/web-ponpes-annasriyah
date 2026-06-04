import { PublishStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

type StatusPayload = {
  status?: string;
};

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
  const payload = (await req.json()) as StatusPayload;
  const status =
    payload.status === "DRAFT" || payload.status === "PUBLISHED"
      ? payload.status
      : null;

  if (!status) {
    return NextResponse.json({ message: "Status album tidak valid." }, { status: 400 });
  }

  const existing = await prisma.galleryAlbum.findUnique({
    where: { id },
    select: {
      id: true,
      publishedAt: true,
    },
  });

  if (!existing) {
    return NextResponse.json({ message: "Album tidak ditemukan." }, { status: 404 });
  }

  const item = await prisma.galleryAlbum.update({
    where: { id },
    data: {
      status,
      publishedAt:
        status === PublishStatus.PUBLISHED ? existing.publishedAt ?? new Date() : null,
    },
    select: {
      id: true,
      status: true,
      publishedAt: true,
    },
  });

  return NextResponse.json(item);
}
