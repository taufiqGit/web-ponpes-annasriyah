import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Section from "@/components/Section";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <Section title="Login Portal" description="Akses layanan login melalui Portal Wali Santri resmi Pondok Pesantren Annasriyah.">
      <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Login" }]} />
      <Card className="mx-auto max-w-3xl p-6 text-center md:p-8">
        <div className="space-y-4">
          <p className="inline-flex rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary-dark)]">
            Portal Wali Santri
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">Login via Portal Wali Santri</h2>
          <p className="text-sm leading-8 text-[var(--muted-foreground)] md:text-base">
            Untuk memantau informasi dan kebutuhan layanan wali santri, silakan masuk melalui portal resmi menggunakan tombol berikut.
          </p>
          <div className="flex justify-center pt-2">
            <Button href="https://portal.annasriyah.sch.id"  external>Buka Portal Wali Santri</Button>
          </div>
        </div>
      </Card>
    </Section>
  );
}
