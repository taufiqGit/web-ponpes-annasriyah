import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import Section from "@/components/Section";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type AlbumPageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(value: Date | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
  }).format(value);
}

export async function generateMetadata({ params }: AlbumPageProps) {
  const { id } = await params;
  const album = await prisma.galleryAlbum.findFirst({
    where: {
      id,
      status: "PUBLISHED",
    },
    select: {
      title: true,
      description: true,
    },
  });

  if (!album) {
    return { title: "Album Tidak Ditemukan" };
  }

  return {
    title: `${album.title} | Galeri`,
    description: album.description || "Detail album galeri Pondok Pesantren Annasriyah.",
  };
}

export default async function GaleriDetailPage({ params }: AlbumPageProps) {
  const { id } = await params;
  const album = await prisma.galleryAlbum.findFirst({
    where: {
      id,
      status: "PUBLISHED",
    },
    include: {
      images: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
      _count: {
        select: {
          images: true,
        },
      },
    },
  });

  if (!album) {
    notFound();
  }

  const cover = album.images[0];
  const albumDate = formatDate(album.eventDate ?? album.publishedAt ?? album.createdAt);

  return (
    <Section
      title={album.title}
      description={album.description || "Dokumentasi lengkap album galeri Pondok Pesantren Annasriyah."}
    >
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Galeri", href: "/galeri" },
          { label: album.title },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden p-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] bg-[var(--primary-soft)]">
            {cover ? (
              <Image src={cover.imageUrl} alt={album.title} fill className="object-cover" priority />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[var(--muted-foreground)]">
                Belum ada gambar utama
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary-dark)]">
              <span>{album._count.images} Foto</span>
              {albumDate ? <span>{albumDate}</span> : null}
            </div>
            <p className="text-sm leading-7 text-[var(--muted-foreground)]">
              {album.description || "Album ini berisi dokumentasi kegiatan dan kebersamaan santri di lingkungan pondok."}
            </p>
            <Link
              href="/galeri"
              className="inline-flex rounded-full bg-[var(--primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--primary-dark)]"
            >
              Kembali ke galeri
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {album.images.map((image, index) => (
          <Card key={image.id} className="overflow-hidden p-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-[var(--primary-soft)]">
              <Image
                src={image.imageUrl}
                alt={image.caption || `${album.title} - Foto ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3 pb-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary-dark)]">
                Foto {index + 1}
              </p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {image.caption || "Dokumentasi kegiatan album."}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
