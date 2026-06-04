import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import Section from "@/components/Section";

export const metadata = { title: "Profil" };

const values = [
  "Adab sebagai pondasi utama pendidikan",
  "Belajar terstruktur dengan suasana menenangkan",
  "Kolaborasi pesantren dan wali santri",
  "Penguatan karakter, akademik, dan kemandirian",
];

export default function ProfilPage() {
  return (
    <Section title="Profil Pondok Pesantren Annasriyah" description="Mengenal lebih dekat lingkungan pendidikan Annasriyah di Brabo, Tanggungharjo, Grobogan, Jawa Tengah.">
      <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Profil" }]} />
      <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="space-y-4 text-sm leading-8 text-[var(--muted-foreground)] md:text-base">
            <p>Pondok Pesantren Annasriyah hadir sebagai ruang pendidikan yang memadukan pembinaan akhlak, pendalaman ilmu, dan pembiasaan hidup tertib dalam suasana yang teduh.</p>
            <p>Dengan jenjang pendidikan Dasar hingga MA, Annasriyah berupaya menumbuhkan santri yang berilmu, beradab, serta siap melangkah pada fase berikutnya dengan lebih matang.</p>
            <p>Lingkungan belajar dirancang hangat dan komunikatif, sehingga santri dapat bertumbuh secara akademik, spiritual, maupun sosial secara seimbang.</p>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Nilai Utama</h2>
          <div className="grid gap-3">
            {values.map((item) => (
              <div key={item} className="rounded-2xl bg-[var(--secondary)] px-4 py-4 text-sm leading-7">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}
