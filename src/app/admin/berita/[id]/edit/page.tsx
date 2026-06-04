import type { JSONContent } from "@tiptap/core";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import NewsForm from "@/app/admin/berita/_components/NewsForm";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function EditNewsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const [item, categories] = await Promise.all([
    prisma.news.findUnique({
      where: { id: params.id },
    }),
    prisma.category.findMany({
      where: { type: "NEWS" },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!item) {
    return (
      <div className="px-6 py-8 text-slate-100">
        <h1 className="text-xl font-semibold">Edit Berita</h1>
        <p className="mt-2 text-red-300">Data berita tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <NewsForm
      categories={categories}
      initial={{
        id: item.id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content as JSONContent,
        coverUrl: item.coverUrl,
        status: item.status,
        categoryId: item.categoryId,
      }}
    />
  );
}
