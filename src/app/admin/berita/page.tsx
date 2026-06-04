import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FilePlus2, Pencil } from "lucide-react";
import DeleteNewsButton from "@/app/admin/berita/_components/DeleteNewsButton";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";

type NewsCategory = {
  id: string;
  name: string;
};

type NewsRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "DRAFT" | "PUBLISHED";
  createdAt: Date;
  category: NewsCategory | null;
};

function qs(params: Record<string, string | undefined>) {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) s.set(key, value);
  });
  return s.toString();
}

export default async function NewsListPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const pageParam = Array.isArray(resolvedSearchParams.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams.page;
  const perPageParam = Array.isArray(resolvedSearchParams.perPage)
    ? resolvedSearchParams.perPage[0]
    : resolvedSearchParams.perPage;
  const search = Array.isArray(resolvedSearchParams.search)
    ? resolvedSearchParams.search[0]
    : resolvedSearchParams.search;
  const status = Array.isArray(resolvedSearchParams.status)
    ? resolvedSearchParams.status[0]
    : resolvedSearchParams.status;
  const categoryId = Array.isArray(resolvedSearchParams.categoryId)
    ? resolvedSearchParams.categoryId[0]
    : resolvedSearchParams.categoryId;
  const page = Number(pageParam || "1");
  const perPage = Math.min(Number(perPageParam || "10"), 50);
  const where: Prisma.NewsWhereInput = {};

  if (search) where.title = { contains: search, mode: "insensitive" };
  if (status === "DRAFT" || status === "PUBLISHED") where.status = status;
  if (categoryId) where.categoryId = categoryId;

  const [items, total, categories, publishedCount, draftCount] =
    await Promise.all([
      prisma.news.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.news.count({ where }),
      prisma.category.findMany({
        where: { type: "NEWS" },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.news.count({ where: { status: "PUBLISHED" } }),
      prisma.news.count({ where: { status: "DRAFT" } }),
    ]);

  const pages = Math.max(1, Math.ceil(total / perPage));
  if (page > pages && pages > 0) return notFound();

  return (
    <div className="space-y-6 px-4 py-5 md:px-6 lg:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Admin / Berita</p>
          <h1 className="text-2xl font-semibold text-white">Manajemen Berita</h1>
          <p className="mt-1 text-sm text-slate-400">
            Kelola artikel, status publikasi, dan konten Tiptap dalam format JSON.
          </p>
        </div>
        <Link
          href="/admin/berita/new"
          className={cn(
            buttonVariants(),
            "bg-gray-500 text-black hover:bg-gray-400"
          )}
        >
          <FilePlus2 className="size-4" />
          Tulis Berita
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
          <CardHeader className="px-5 pt-5">
            <CardDescription>Total Berita</CardDescription>
            <CardTitle className="text-3xl text-white">{total}</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 text-sm text-slate-500">
            Jumlah data berita yang sesuai dengan filter aktif.
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
          <CardHeader className="px-5 pt-5">
            <CardDescription>Berita Published</CardDescription>
            <CardTitle className="text-3xl text-white">{publishedCount}</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 text-sm text-slate-500">
            Siap tampil di halaman publik.
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
          <CardHeader className="px-5 pt-5">
            <CardDescription>Berita Draft</CardDescription>
            <CardTitle className="text-3xl text-white">{draftCount}</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 text-sm text-slate-500">
            Masih menunggu revisi atau persetujuan.
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
        <CardHeader className="border-b border-white/10 px-5 py-4">
          <CardTitle className="text-white">Filter Berita</CardTitle>
          <CardDescription className="text-slate-500">
            Saring daftar berdasarkan judul, status, dan kategori.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 py-5">
          <form className="grid gap-3 md:grid-cols-4">
            <Input
              name="search"
              placeholder="Cari judul berita..."
              defaultValue={search}
              className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
            />
            <select
              name="status"
              defaultValue={status || ""}
              className="h-8 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Semua Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
            </select>
            <select
              name="categoryId"
              defaultValue={categoryId || ""}
              className="h-8 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category: NewsCategory) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Button type="submit" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              Terapkan Filter
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
        <CardHeader className="border-b border-white/10 px-5 py-4">
          <CardTitle className="text-white">Daftar Berita</CardTitle>
          <CardDescription className="text-slate-500">
            Edit artikel yang ada atau hapus data yang sudah tidak dipakai.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 py-5">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-500">Judul</TableHead>
                <TableHead className="text-slate-500">Kategori</TableHead>
                <TableHead className="text-slate-500">Status</TableHead>
                <TableHead className="text-slate-500">Dibuat</TableHead>
                <TableHead className="text-right text-slate-500">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item: NewsRow) => (
                <TableRow
                  key={item.id}
                  className="border-white/10 hover:bg-white/[0.02]"
                >
                  <TableCell className="min-w-[320px] whitespace-normal">
                    <div className="space-y-1">
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="text-xs text-slate-500">/{item.slug}</p>
                      <p className="line-clamp-2 text-sm text-slate-400">
                        {item.excerpt}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {item.category?.name || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "border-white/10",
                        item.status === "PUBLISHED"
                          ? "text-lime-300"
                          : "text-amber-300"
                      )}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400">
                    {new Intl.DateTimeFormat("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(item.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        href={`/admin/berita/${item.id}/edit`}
                        className={cn(
                          buttonVariants({ size: "sm", variant: "ghost" }),
                          "text-slate-300 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Pencil className="size-4" />
                        Edit
                      </Link>
                      <DeleteNewsButton newsId={item.id} title={item.title} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {items.length === 0 ? (
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableCell colSpan={5} className="py-10 text-center text-slate-500">
                    Belum ada berita yang cocok dengan filter saat ini.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {Array.from({ length: pages }).map((_, index) => {
              const currentPage = index + 1;
              const href = `?${qs({
                search,
                status,
                categoryId,
                page: String(currentPage),
                perPage: String(perPage),
              })}`;

              return (
                <Link
                  key={currentPage}
                  href={href}
                  className={cn(
                    buttonVariants({
                      size: "sm",
                      variant: currentPage === page ? "secondary" : "outline",
                    }),
                    currentPage === page
                      ? "bg-white/10 text-white hover:bg-white/10"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {currentPage}
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
