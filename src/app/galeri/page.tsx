import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import Section from "@/components/Section";
import prisma from "@/lib/prisma";

export const metadata = { title: "Galeri" };

function formatDate(value: Date | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(value);
}

export default async function GaleriPage() {
  const albums = await prisma.galleryAlbum.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      images: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        take: 1,
      },
      _count: {
        select: {
          images: true,
        },
      },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <Section
      title="Galeri Kegiatan"
      description="Dokumentasi suasana belajar, kebersamaan, dan aktivitas santri di Pondok Pesantren Annasriyah."
    >
      <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Galeri" }]} />
      {albums.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {albums.map((album) => {
            const cover = album.images[0];
            const albumDate = formatDate(album.eventDate ?? album.publishedAt ?? album.createdAt);

            return (
              <Link key={album.id} href={`/galeri/${album.id}`} className="group">
                <Card className="h-full overflow-hidden p-2 transition duration-200 group-hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-[var(--primary-soft)]">
                    {cover ? (
                      <Image
                        src={cover.imageUrl}
                        alt={album.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[var(--muted-foreground)]">
                        Belum ada gambar
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 p-3 pb-2">
                    <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary-dark)]">
                      <span>{album._count.images} Foto</span>
                      {albumDate ? <span>{albumDate}</span> : null}
                    </div>
                    <h2 className="text-base font-semibold md:text-lg">{album.title}</h2>
                    <p className="line-clamp-2 text-sm text-[var(--muted-foreground)]">
                      {album.description || "Lihat dokumentasi lengkap album ini."}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-lg font-semibold">Galeri belum tersedia</p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Album yang sudah dipublikasikan akan tampil di halaman ini.
          </p>
        </Card>
      )}
    </Section>
  );
}
