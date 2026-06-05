import Breadcrumb from "@/components/Breadcrumb";
import NewsSearch from "@/components/NewsSearch";
import Section from "@/components/Section";
import { mapPublicNewsItem } from "@/lib/public-news";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = { title: "Berita" };

export default async function BeritaPage() {
  const items = await prisma.news.findMany({
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
  });

  return (
    <Section title="Berita dan Informasi" description="Ikuti kabar terbaru, pengumuman, dan cerita kegiatan dari Pondok Pesantren Annasriyah.">
      <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Berita" }]} />
      <NewsSearch items={items.map(mapPublicNewsItem)} />
    </Section>
  );
}
