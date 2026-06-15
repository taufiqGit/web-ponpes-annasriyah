import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Section from "@/components/Section";

export const metadata = { title: "Kontak" };

const cards = [
  ["Alamat", "Brabo, Kecamatan Tanggungharjo, Kabupaten Grobogan, Jawa Tengah."],
  ["WhatsApp", "+62 857-9610-6086"],
  ["Email", "ponpes.annashriyyah@gmail.com"],
] as const;

export default function KontakPage() {
  return (
    <Section title="Kontak Kami" description="Hubungi Pondok Pesantren Annasriyah untuk informasi pendaftaran, program, dan konsultasi kebutuhan pendidikan santri.">
      <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Kontak" }]} />
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">Alamat Lengkap</h2>
            <p className="text-sm leading-8 text-[var(--muted-foreground)] md:text-base">
              Pondok Pesantren Annasriyah, Brabo, Kecamatan Tanggungharjo, Kabupaten Grobogan, Jawa Tengah.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button href="https://wa.me/6285796106086" className="!text-white" external>Hubungi WhatsApp</Button>
              {/* <Button href="https://portal.annasriyah.sch.id" external variant="secondary">Portal Wali Santri</Button> */}
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            {cards.map(([title, content]) => (
              <Card key={title} className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary-dark)]">{title}</p>
                <p className="mt-3 text-sm leading-7">{content}</p>
              </Card>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden p-3">
          <div className="grid-pattern flex min-h-[440px] items-center justify-center rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(232,246,236,0.9))] p-6 text-center">
            <div className="max-w-md space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary-dark)]">Placeholder Peta</p>
              <h2 className="text-2xl font-semibold">Lokasi Pondok Pesantren Annasriyah</h2>
              {/* <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                Area ini dapat diganti dengan embed Google Maps atau peta interaktif ketika data koordinat final sudah tersedia.
              </p> */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d789.259919209218!2d110.57923901886771!3d-7.088681274027602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7091666547bd9b%3A0x9077f9e0f37e1dc6!2sPonpes%20An%20Nashriyyah!5e1!3m2!1sen!2sid!4v1781518051652!5m2!1sen!2sid"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}
