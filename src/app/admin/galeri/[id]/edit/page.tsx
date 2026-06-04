import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import EditForm from "@/app/admin/galeri/_components/EditForm";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function EditGalleryPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const item = await prisma.galleryAlbum.findUnique({
    where: { id: params.id },
    include: {
      images: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!item) {
    return (
      <div className="p-6 text-slate-100">
        <h1 className="mb-2 text-xl font-semibold">Edit Album Galeri</h1>
        <p className="text-red-300">Album tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <EditForm
      item={{
        id: item.id,
        title: item.title,
        description: item.description,
        status: item.status,
        eventDate: item.eventDate ? item.eventDate.toISOString().slice(0, 10) : "",
        images: item.images.map((image) => ({
          id: image.id,
          imageUrl: image.imageUrl,
          caption: image.caption,
        })),
      }}
    />
  );
}
