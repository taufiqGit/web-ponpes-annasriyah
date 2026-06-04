import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import NewsForm from "@/app/admin/berita/_components/NewsForm";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Berita Baru",
};

export default async function NewNewsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const categories = await prisma.category.findMany({
    where: { type: "NEWS" },
    orderBy: { name: "asc" },
  });

  return <NewsForm categories={categories} />;
}
