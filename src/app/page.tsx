import Image from "next/image";
import NewsCard from "@/components/NewsCard";
import Section from "@/components/Section";
import { mapPublicNewsItem } from "@/lib/public-news";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const latestNews = (
    await prisma.news.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        coverUrl: true,
        publishedAt: true,
        createdAt: true,
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 3,
    })
  ).map(mapPublicNewsItem);

  const latestGalleryAlbums = await prisma.galleryAlbum.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      images: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        take: 1,
      },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 6,
  });

  return (
    <>
      <section className="pb-12 md:pb-16">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src="/images/ponpes-hero.jpeg"
            alt="Gedung Pondok Pesantren Annasriyah"
            fill
            priority
            className="object-cover"
          />
        </div>
      </section>
      {/* <Section eyebrow="Berita Terbaru" title="Informasi terbaru dari lingkungan Pondok Pesantren Annasriyah.">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {latestNews.map((item) => (
            <NewsCard key={item.slug} item={item} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Galeri" title="Potret suasana belajar dan kebersamaan di Annasriyah.">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {latestGalleryAlbums.map((album) => (
            <div key={album.id} className="surface overflow-hidden rounded-[28px] p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
                {album.images[0] ? (
                  <Image
                    src={album.images[0].imageUrl}
                    alt={album.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[var(--primary-soft)] text-sm text-[var(--muted-foreground)]">
                    Belum ada gambar
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section> */}
    </>
  );
}
