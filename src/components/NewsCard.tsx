import Image from "next/image";
import Link from "next/link";
import Card from "@/components/Card";
import type { PublicNewsItem } from "@/types/news";

export default function NewsCard({ item }: { item: PublicNewsItem }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden">
        {item.coverImage ? (
          <Image src={item.coverImage} alt={item.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-[var(--primary-soft)] text-sm text-[var(--muted-foreground)]">
            Belum ada cover
          </div>
        )}
      </div>
      <div className="space-y-4 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary-dark)]">
          {item.date}
        </p>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{item.title}</h3>
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">{item.excerpt}</p>
        </div>
        <Link href={`/berita/${item.slug}`} className="text-sm font-semibold text-[var(--primary-dark)]">
          Baca selengkapnya
        </Link>
      </div>
    </Card>
  );
}
