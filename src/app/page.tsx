import Image from "next/image";
import Button from "@/components/Button";
import Card from "@/components/Card";
import NewsCard from "@/components/NewsCard";
import Section from "@/components/Section";
import TimelineStepper from "@/components/TimelineStepper";
import { mapPublicNewsItem } from "@/lib/public-news";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const trustBar = [
  "Lingkungan belajar teduh dan tertata",
  "Pendampingan adab, akademik, dan diniyah",
  "Jenjang pendidikan Dasar hingga MA",
  "Akses PPDB online dan portal wali santri",
];

const stats = [
  { value: "25+", label: "Tahun pengabdian pendidikan" },
  { value: "6", label: "Program unggulan terarah" },
  { value: "4", label: "Jenjang pembinaan utama" },
  { value: "1000+", label: "Keluarga besar santri dan alumni" },
];

const jenjang = [
  "Dasar: pondasi akhlak dan semangat belajar",
  "Menengah Pertama: penguatan akademik dan karakter",
  "Menengah Atas: kesiapan lanjut studi dan kemandirian",
];

const programs = [
  "Tahfidz dan pembinaan adab harian",
  "Pendalaman akademik terstruktur",
  "Penguatan bahasa dan public speaking",
  "Kegiatan literasi dan kepemimpinan",
  "Ekstrakurikuler kreatif dan olahraga",
  "Pendampingan komunikasi wali santri",
];

const steps = [
  { title: "Isi Formulir", description: "Calon santri mengisi formulir PPDB online melalui portal resmi." },
  { title: "Unggah Dokumen", description: "Lengkapi dokumen administrasi sesuai petunjuk yang tersedia." },
  { title: "Verifikasi Data", description: "Panitia memeriksa kelengkapan data dan memberikan konfirmasi." },
  { title: "Observasi", description: "Ikuti tahapan seleksi atau observasi sesuai informasi dari panitia." },
  { title: "Daftar Ulang", description: "Lakukan daftar ulang setelah dinyatakan diterima." },
];

const testimonials = [
  "Kami merasakan lingkungan yang tenang, komunikatif, dan sangat memperhatikan pembinaan akhlak anak.",
  "Program belajarnya tertata dan guru membimbing dengan sabar, sehingga saya lebih percaya diri berkembang.",
  "Portal wali santri membantu kami mengikuti perkembangan anak dengan lebih mudah dan nyaman.",
];

export default async function HomePage() {
  const latestNews = (
    await prisma.news.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        coverUrl: true,
        publishedAt: true,
        createdAt: true,
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 3,
    })
  ).map(mapPublicNewsItem);

  const latestGalleryAlbums = await prisma.galleryAlbum.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      images: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        take: 1,
      },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 6,
  });

  return (
    <>
      <section className="pb-12 pt-8 md:pb-16 md:pt-12">
        <div className="container-page">
          <div className="grid-pattern surface overflow-hidden rounded-[36px] px-5 py-8 md:px-10 md:py-12">
            <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div className="space-y-6">
                <p className="inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--primary-dark)]">
                  Pendidikan Teduh, Terarah, dan Berakhlak
                </p>
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                    Pondok Pesantren Annasriyah untuk tumbuhnya generasi berilmu dan beradab.
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-[var(--muted-foreground)] md:text-lg">
                    Berlokasi di Brabo, Tanggungharjo, Grobogan, Jawa Tengah. Annasriyah menghadirkan pendidikan Dasar hingga MA dengan suasana modern, hangat, dan menenangkan.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button href="https://ppdb.annasriyah.sch.id" className="!text-white" external>Daftar PPDB Online</Button>
                  <Button href="https://portal.annasriyah.sch.id" external variant="secondary">Portal Wali Santri</Button>
                  <Button href="/program" variant="ghost">Lihat Program</Button>
                </div>
              </div>

              <Card className="overflow-hidden p-5 md:p-6">
                <div className="space-y-5">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[28px]">
                    <Image src="/uploads/pondok-an.png" alt="Suasana Pondok Pesantren Annasriyah" fill priority className="object-cover" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {stats.map((item) => (
                      <div key={item.label} className="rounded-2xl bg-[var(--secondary)] p-4">
                        <div className="text-2xl font-bold text-[var(--primary-dark)]">{item.value}</div>
                        <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-6">
        <div className="container-page grid gap-3 md:grid-cols-4">
          {trustBar.map((item) => (
            <div key={item} className="surface rounded-[24px] px-4 py-4 text-sm font-medium">{item}</div>
          ))}
        </div>
      </section>

      <Section eyebrow="Statistik" title="Langkah pendidikan yang rapi, hangat, dan relevan untuk masa depan santri.">
        <div className="grid gap-5 md:grid-cols-4">
          {stats.map((item) => (
            <Card key={item.label} className="p-6">
              <div className="text-4xl font-bold text-[var(--primary-dark)]">{item.value}</div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{item.label}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="Jenjang" title="Pilihan jenjang pendidikan dari Dasar hingga MA.">
        <div className="grid gap-5 md:grid-cols-3">
          {jenjang.map((item) => (
            <Card key={item} className="p-6">
              <p className="text-sm leading-8 text-[var(--muted-foreground)]">{item}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="Program Unggulan" title="Program yang memperkuat akademik, adab, dan keterampilan santri.">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {programs.map((program, index) => (
            <Card key={program} className="p-6">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-soft)] font-bold text-[var(--primary-dark)]">
                0{index + 1}
              </div>
              <h3 className="text-lg font-semibold">{program}</h3>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="Alur PPDB" title="Proses pendaftaran dibuat jelas dan mudah diikuti.">
        <TimelineStepper steps={steps} />
      </Section>

      <Section eyebrow="Berita Terbaru" title="Informasi terbaru dari lingkungan Pondok Pesantren Annasriyah.">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {latestNews.map((item) => (
            <NewsCard key={item.slug} item={item} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Galeri" title="Potret suasana belajar dan kebersamaan di Annasriyah.">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {latestGalleryAlbums.map((album) => (
            <div key={album.id} className="surface overflow-hidden rounded-[28px] p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
                {album.images[0] ? (
                  <Image
                    src={album.images[0].imageUrl}
                    alt={album.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[var(--primary-soft)] text-sm text-[var(--muted-foreground)]">
                    Belum ada gambar
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Testimoni" title="Cerita hangat dari keluarga besar Annasriyah.">
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item} className="p-6">
              <p className="text-base leading-8">“{item}”</p>
            </Card>
          ))}
        </div>
      </Section>

      <section className="pb-14 pt-4">
        <div className="container-page">
          <div className="surface rounded-[36px] p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div className="space-y-3">
                <p className="inline-flex rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary-dark)]">
                  Siap Bergabung?
                </p>
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  Daftarkan putra-putri Anda dan konsultasikan kebutuhan pendidikan dengan tim kami.
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                <Button href="https://ppdb.annasriyah.sch.id" external className="!text-white">Daftar PPDB Online</Button>
                <Button href="https://wa.me/6280000000000" external variant="secondary">Hubungi WhatsApp</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
