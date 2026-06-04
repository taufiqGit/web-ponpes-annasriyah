import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Card from "@/components/Card";
import PpdbEmbed from "@/components/PpdbEmbed";
import Section from "@/components/Section";

export const metadata = { title: "PPDB" };

export default function PpdbPage() {
  return (
    <Section title="Penerimaan Peserta Didik Baru" description="PPDB Pondok Pesantren Annasriyah sudah tersedia secara online agar proses pendaftaran lebih mudah dan praktis.">
      <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "PPDB" }]} />
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="h-fit p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Informasi Singkat PPDB</h2>
            <p className="text-sm leading-8 text-[var(--muted-foreground)]">
              Pendaftaran calon santri Annasriyah dilakukan melalui portal resmi PPDB. Silakan isi formulir, lengkapi dokumen yang diminta, lalu ikuti tahapan verifikasi dari panitia.
            </p>
            <p className="text-sm leading-8 text-[var(--muted-foreground)]">
              Jika portal tidak tampil di perangkat Anda, gunakan tombol langsung di bawah ini untuk membuka halaman PPDB resmi.
            </p>
            <div className="flex flex-col gap-3">
              <Button href="https://ppdb.annasriyah.sch.id" className="!text-white" external>Buka PPDB Resmi</Button>
              <Button href="https://portal.annasriyah.sch.id" external variant="secondary">Portal Wali Santri</Button>
            </div>
          </div>
        </Card>
        <PpdbEmbed />
      </div>
    </Section>
  );
}
