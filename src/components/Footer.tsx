import Image from "next/image";
import Link from "next/link";

const links = [
  ["/profil", "Profil"],
  ["/program", "Program"],
  ["/ppdb", "PPDB"],
  ["/berita", "Berita"],
  ["/kontak", "Kontak"],
  ["/login", "Login"],
] as const;

export default function Footer() {
  return (
    <footer className="pb-8 pt-14">
      <div className="container-page">
        <div className="surface rounded-[32px] p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-[1.3fr_0.9fr_1fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white ring-1 ring-[var(--line)]">
                  <Image src="/logo.png" alt="Logo Pondok Pesantren Annasriyah" fill className="object-contain p-2" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Pondok Pesantren Annasriyah</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Dasar hingga MA di lingkungan belajar yang teduh, terarah, dan berakhlak.
                  </p>
                </div>
              </div>
              <p className="max-w-md text-sm leading-7 text-[var(--muted-foreground)]">
                Alamat: Brabo, Kecamatan Tanggungharjo, Kabupaten Grobogan, Jawa Tengah.
              </p>
            </div>

            <div>
              {/* <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary-dark)]">
                Navigasi
              </h4>
              <div className="grid gap-2 text-sm text-[var(--muted-foreground)]">
                {links.map(([href, label]) => (
                  <Link key={href} href={href} className="hover:text-[var(--foreground)]">
                    {label}
                  </Link>
                ))}
              </div> */}
            </div>

            <div>
              {/* <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary-dark)]">
                Tautan Penting
              </h4>
              <div className="grid gap-3 text-sm">
                <a
                  href="https://ppdb.annasriyah.sch.id"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-[var(--primary-soft)] px-4 py-3 font-medium text-[var(--primary-dark)]"
                >
                  Daftar PPDB Online
                </a>
                <a
                  href="https://portal.annasriyah.sch.id"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-white px-4 py-3 font-medium text-[var(--foreground)] ring-1 ring-[var(--line)]"
                >
                  Portal Wali Santri
                </a>
              </div> */}
            </div>
          </div>

          <div className="mt-8 border-t border-[var(--line)] pt-5 text-sm text-[var(--muted-foreground)]">
            © 2026 Pondok Pesantren Annasriyah. Semua hak dilindungi.
          </div>
        </div>
      </div>
    </footer>
  );
}
