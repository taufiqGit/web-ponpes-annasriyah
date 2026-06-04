import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import Section from "@/components/Section";
import { renderRichContent } from "@/lib/public-news";
import prisma from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await prisma.news.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    select: {
      title: true,
      excerpt: true,
    },
  });

  return {
    title: item ? item.title : "Berita",
    description: item?.excerpt || "Berita resmi Pondok Pesantren Annasriyah.",
  };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await prisma.news.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    select: {
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverUrl: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  if (!item) notFound();

  const publishedDate = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(item.publishedAt ?? item.createdAt);

  return (
    <Section title={item.title} description={item.excerpt || "Berita resmi Pondok Pesantren Annasriyah dengan tampilan baca yang rapi dan nyaman."}>
      <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Berita", href: "/berita" }, { label: item.title }]} />
      <Card className="overflow-hidden">
        <div className="relative aspect-[16/7] overflow-hidden">
          {item.coverUrl ? (
            <Image src={item.coverUrl} alt={item.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-[var(--primary-soft)] text-sm text-[var(--muted-foreground)]">
              Belum ada cover berita
            </div>
          )}
        </div>
        <div className="p-6 md:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary-dark)]">{publishedDate}</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{item.title}</h1>
          <div className="prose-annasriyah mt-8 max-w-none text-sm md:text-base">
            {renderRichContent(item.content)}
          </div>
        </div>
      </Card>
    </Section>
  );
}
