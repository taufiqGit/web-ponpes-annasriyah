import prisma from "@/lib/prisma";
import EditForm from "./ui";

export default async function EditActivityPage({ params }: { params: { id: string } }) {
  const item = await prisma.activity.findUnique({ where: { id: params.id } });
  if (!item) return <div className="p-6">Data tidak ditemukan</div>;
  const categories = await prisma.category.findMany({ where: { type: "ACTIVITY" }, orderBy: { name: "asc" } });
  return <EditForm initial={item} categories={categories} />;
}