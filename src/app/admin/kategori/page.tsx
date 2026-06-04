import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import CategoryManager from "./_components/CategoryManager";

export const metadata = {
  title: "Kategori",
};

export default async function AdminKategoriPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const categories = await prisma.category.findMany({
    orderBy: [{ type: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: {
          news: true,
          activities: true,
        },
      },
    },
  });

  return (
    <div className="px-4 py-5 md:px-6 lg:px-8">
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
