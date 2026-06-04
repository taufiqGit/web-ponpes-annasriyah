import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import EditForm from "@/app/admin/galeri/_components/EditForm";

export const metadata = {
  title: "Album Baru",
};

export default async function NewGalleryAlbumPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return <EditForm />;
}
