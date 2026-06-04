import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import Section from "@/components/Section";

export const metadata = { title: "Jenjang" };

const items = [
  ["Jenjang Dasar", "Menanamkan kebiasaan baik, semangat belajar, dan pondasi adab sejak dini melalui pembinaan yang lembut namun terarah."],
  ["Jenjang Menengah Pertama", "Mendorong pertumbuhan akademik dan karakter santri dengan kurikulum yang tertib serta pendampingan keseharian yang konsisten."],
  ["Jenjang Menengah Atas", "Menguatkan kesiapan santri untuk studi lanjut, peran sosial, serta kemandirian dengan fokus pada kedewasaan berpikir dan sikap."],
] as const;

export default function JenjangPage() {
  return (
    <Section title="Jenjang Pendidikan" description="Pilihan jenjang di Annasriyah disusun untuk mendampingi perkembangan santri secara bertahap dan berkesinambungan.">
      <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Jenjang" }]} />
      <div className="grid gap-5 md:grid-cols-3">
        {items.map(([title, description]) => (
          <Card key={title} className="p-6">
            <h2 className="mb-3 text-2xl font-semibold tracking-tight">{title}</h2>
            <p className="text-sm leading-8 text-[var(--muted-foreground)]">{description}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
