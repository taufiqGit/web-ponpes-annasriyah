import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import Section from "@/components/Section";

export const metadata = { title: "Program" };

const programs = [
  ["Tahfidz dan Adab Harian", "Membentuk kedekatan dengan Al-Qur'an sekaligus menjaga pembiasaan akhlak mulia dalam keseharian santri."],
  ["Akademik Terarah", "Pendalaman pelajaran umum dan diniyah dengan ritme belajar yang terstruktur, rapi, dan mudah diikuti."],
  ["Bahasa dan Public Speaking", "Mendorong keberanian tampil, kemampuan komunikasi, dan kepercayaan diri santri di ruang publik."],
  ["Literasi dan Kepemimpinan", "Mengembangkan kebiasaan membaca, berpikir kritis, dan tanggung jawab melalui berbagai aktivitas pembinaan."],
  ["Ekstrakurikuler Produktif", "Ruang pengembangan minat dan bakat santri melalui kegiatan kreatif, olahraga, dan kerja sama tim."],
  ["Sinergi Wali Santri", "Komunikasi yang lebih mudah melalui layanan informasi dan portal wali santri untuk mendukung pembinaan bersama."],
] as const;

export default function ProgramPage() {
  return (
    <Section title="Program Unggulan" description="Program pendidikan di Annasriyah dirancang untuk membentuk santri yang seimbang dalam ilmu, karakter, dan keterampilan hidup.">
      <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Program" }]} />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {programs.map(([title, description], index) => (
          <Card key={title} className="p-6">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-soft)] font-bold text-[var(--primary-dark)]">
              0{index + 1}
            </div>
            <h2 className="mb-3 text-xl font-semibold">{title}</h2>
            <p className="text-sm leading-8 text-[var(--muted-foreground)]">{description}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
