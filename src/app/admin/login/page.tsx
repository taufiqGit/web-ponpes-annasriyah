import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import Card from "@/components/Card";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Login Admin",
};

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/admin");
  }

  return (
    <section className="min-h-screen px-4 py-10 md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center">
        <div className="grid w-full gap-5 md:grid-cols-[1fr_0.9fr]">
          <Card className="grid-pattern p-7 md:p-10">
            <div className="space-y-5">
              <p className="inline-flex rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary-dark)]">
                Admin Annasriyah
              </p>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                  Login admin untuk mengakses area pengelolaan konten.
                </h1>
                <p className="text-sm leading-8 text-[var(--muted-foreground)] md:text-base">
                  Gunakan username dan password admin. Setelah berhasil login, semua route
                  di bawah `/admin` akan dapat diakses sesuai sesi aktif Anda.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 md:p-8">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-semibold">Masuk Admin</h2>
              <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                Autentikasi menggunakan `next-auth` Credentials.
              </p>
            </div>
            <AdminLoginForm />
          </Card>
        </div>
      </div>
    </section>
  );
}
