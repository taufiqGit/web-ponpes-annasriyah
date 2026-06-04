import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 dark">
      <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-[1600px] lg:grid-cols-[260px_1fr]">
        <AdminSidebar />
        <main className="min-w-0 bg-[#050505]">
          {children}
        </main>
      </div>
    </div>
  );
}
