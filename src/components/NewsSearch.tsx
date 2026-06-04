"use client";

import { useMemo, useState } from "react";
import NewsCard from "@/components/NewsCard";
import type { PublicNewsItem } from "@/types/news";

export default function NewsSearch({ items }: { items: PublicNewsItem[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return items;

    return items.filter((item) =>
      [item.title, item.excerpt, item.content].some((value) => value.toLowerCase().includes(keyword))
    );
  }, [items, query]);

  return (
    <div className="space-y-6">
      <div className="surface rounded-[28px] p-4 md:p-5">
        <label htmlFor="search-news" className="mb-2 block text-sm font-medium">
          Cari berita
        </label>
        <input
          id="search-news"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari judul, ringkasan, atau isi berita..."
          className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <NewsCard key={item.slug} item={item} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="surface rounded-[28px] p-10 text-center text-sm text-[var(--muted-foreground)]">
          Berita tidak ditemukan. Coba gunakan kata kunci yang lebih umum.
        </div>
      ) : null}
    </div>
  );
}
