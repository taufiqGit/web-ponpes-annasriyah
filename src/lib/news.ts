export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  coverImage: string;
};

export const newsItems: NewsItem[] = [
  {
    slug: "pembukaan-ppdb-annasriyah-2026",
    title: "Pembukaan PPDB Annasriyah 2026 Resmi Dimulai",
    date: "03 Juni 2026",
    excerpt: "Pendaftaran peserta didik baru resmi dibuka untuk jenjang Dasar hingga MA dengan alur yang mudah dan terintegrasi.",
    content:
      "Pondok Pesantren Annasriyah resmi membuka Penerimaan Peserta Didik Baru tahun ajaran 2026/2027 untuk jenjang Dasar hingga MA.\n\nProses pendaftaran dilakukan secara online agar lebih mudah diakses oleh calon santri dan wali santri dari berbagai daerah.\n\nTim panitia juga menyiapkan layanan informasi melalui WhatsApp untuk membantu proses konsultasi.",
    coverImage: "/uploads/1771491725114-IMG_2587.JPG",
  },
  {
    slug: "santri-raih-prestasi-tingkat-kabupaten",
    title: "Santri Annasriyah Raih Prestasi Tingkat Kabupaten",
    date: "28 Mei 2026",
    excerpt: "Prestasi membanggakan diraih oleh santri Annasriyah dalam ajang lomba akademik dan keagamaan tingkat kabupaten Grobogan.",
    content:
      "Santri Pondok Pesantren Annasriyah kembali menorehkan prestasi melalui ajang lomba tingkat kabupaten.\n\nCapaian ini menjadi bukti bahwa pembinaan di Annasriyah tidak hanya fokus pada akademik dan diniyah, tetapi juga membangun kepercayaan diri dan karakter.\n\nPesantren akan terus menghadirkan pendampingan intensif agar potensi setiap santri berkembang lebih maksimal.",
    coverImage: "/uploads/1771573695686-WhatsApp_Image_2026-01-12_at_15.21.35.jpeg",
  },
  {
    slug: "program-penguatan-adab-dan-literasi",
    title: "Program Penguatan Adab dan Literasi Diperluas",
    date: "18 Mei 2026",
    excerpt: "Penguatan budaya adab dan literasi menjadi program prioritas untuk membangun kebiasaan belajar yang matang sejak dini.",
    content:
      "Pondok Pesantren Annasriyah memperluas program penguatan adab dan literasi sebagai bagian dari pengembangan karakter santri.\n\nKegiatan ini mencakup pembiasaan membaca, diskusi tematik, serta pendampingan sikap harian.\n\nProgram juga melibatkan sinergi wali santri agar pembentukan karakter berlangsung selaras antara pesantren dan rumah.",
    coverImage: "/uploads/1771561664895-zahetkopi.png",
  },
  {
    slug: "kegiatan-kebersamaan-santri-dan-wali",
    title: "Kegiatan Kebersamaan Santri dan Wali Berjalan Hangat",
    date: "09 Mei 2026",
    excerpt: "Momentum kebersamaan menjadi ruang silaturahmi antara pesantren, santri, dan wali santri dalam suasana yang penuh keakraban.",
    content:
      "Agenda kebersamaan santri dan wali santri berlangsung hangat dan tertib di lingkungan Pondok Pesantren Annasriyah.\n\nAcara ini menjadi sarana penguatan komunikasi antara lembaga dengan keluarga santri.\n\nKegiatan semacam ini akan terus dihadirkan sebagai bagian dari budaya komunikasi yang terbuka dan konstruktif.",
    coverImage: "/uploads/1771492453550-IMG_2586.jpg",
  },
];

export function getLatestNews(limit = 3) {
  return newsItems.slice(0, limit);
}

export function getNewsBySlug(slug: string) {
  return newsItems.find((item) => item.slug === slug);
}
