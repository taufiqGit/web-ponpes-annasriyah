import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ImageIcon, Pencil, Plus, FolderOpen } from "lucide-react";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import DeleteAlbumButton from "./_components/DeleteAlbumButton";
import ToggleAlbumStatusButton from "./_components/ToggleAlbumStatusButton";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Galeri Admin",
};

export default async function AdminGaleriPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const [albums, publishedCount, draftCount] = await Promise.all([
    prisma.galleryAlbum.findMany({
      orderBy: [{ createdAt: "desc" }],
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
    }),
    prisma.galleryAlbum.count({ where: { status: "PUBLISHED" } }),
    prisma.galleryAlbum.count({ where: { status: "DRAFT" } }),
  ]);

  return (
    <div className="space-y-6 px-4 py-5 md:px-6 lg:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Admin / Galeri</p>
            <h1 className="text-2xl font-semibold text-white">Album Galeri</h1>
            <p className="mt-1 text-sm text-slate-400">
              Kelola album, banyak gambar, dan status publikasi galeri pondok.
            </p>
          </div>
          <Link
            href="/admin/galeri/new"
            className={cn(
              buttonVariants(),
              "bg-gray-500 text-black hover:bg-gray-400"
            )}
          >
            <Plus className="size-4" />
            Album Baru
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
            <CardHeader className="px-5 pt-5">
              <CardDescription>Total Album</CardDescription>
              <CardTitle className="text-3xl text-white">{albums.length}</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 text-sm text-slate-500">
              Semua album galeri yang tersimpan di database.
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
            <CardHeader className="px-5 pt-5">
              <CardDescription>Album Published</CardDescription>
              <CardTitle className="text-3xl text-white">{publishedCount}</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 text-sm text-slate-500">
              Siap ditampilkan di website publik.
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
            <CardHeader className="px-5 pt-5">
              <CardDescription>Album Draft</CardDescription>
              <CardTitle className="text-3xl text-white">{draftCount}</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 text-sm text-slate-500">
              Masih dalam proses kurasi atau upload gambar.
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
          <CardHeader className="border-b border-white/10 px-5 py-4">
            <CardTitle className="text-white">Daftar Album</CardTitle>
            <CardDescription className="text-slate-500">
              Edit metadata album, tambah gambar baru, atau hapus album beserta isi fotonya.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 py-5">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-500">Album</TableHead>
                  <TableHead className="text-slate-500">Status</TableHead>
                  <TableHead className="text-slate-500">Gambar</TableHead>
                  <TableHead className="text-slate-500">Dibuat</TableHead>
                  <TableHead className="text-right text-slate-500">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {albums.map((album) => (
                  <TableRow key={album.id} className="border-white/10 hover:bg-white/[0.02]">
                    <TableCell className="min-w-[280px]">
                      <div className="flex items-center gap-3">
                        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                          {album.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={album.images[0].imageUrl}
                              alt={album.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FolderOpen className="size-5 text-slate-500" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-white">{album.title}</p>
                          <p className="line-clamp-2 text-sm text-slate-400">
                            {album.description || "Belum ada deskripsi album."}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-white/10 text-slate-200"
                      >
                        {album.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      <span className="inline-flex items-center gap-2">
                        <ImageIcon className="size-4 text-lime-400" />
                        {album._count.images} gambar
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {new Intl.DateTimeFormat("id-ID", {
                        dateStyle: "medium",
                      }).format(album.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap justify-end gap-2">
                        <ToggleAlbumStatusButton
                          albumId={album.id}
                          status={album.status}
                        />
                        {/* <Link
                          href={`/admin/galeri/${album.id}/edit`}
                          className={cn(
                            buttonVariants({ size: "sm", variant: "ghost" }),
                            "text-slate-300 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <Pencil className="size-4" />
                          Edit
                        </Link> */}
                        <DeleteAlbumButton albumId={album.id} title={album.title} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {albums.length === 0 ? (
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableCell colSpan={5} className="py-10 text-center text-slate-500">
                      Belum ada album galeri. Buat album pertama dan unggah banyak gambar.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}
