"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";

const items = [
  // ["/", "Beranda"],
  // ["/profil", "Profil"],
  // ["/jenjang", "Jenjang"],
  // ["/program", "Program"],
  // ["/ppdb", "PPDB"],
  ["/berita", "Berita"],
  ["/galeri", "Galeri"],
  ["/kontak", "Kontak"],
  // ["/login", "Login"],
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-[rgba(248,252,248,0.82)] backdrop-blur-xl">
      <div className="container-page py-3">
        <div className="surface flex items-center justify-between rounded-[28px] px-4 py-3 md:px-5">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-white ring-1 ring-[var(--line)]">
              <Image src="/logo.png" alt="Logo Pondok Pesantren Annasriyah" fill className="object-contain p-2" />
            </div>
            <div>
              <p className="text-sm font-bold">Pondok Pesantren Annasriyah</p>
              <p className="text-xs text-[var(--muted-foreground)]">Brabo, Tanggungharjo, Grobogan</p>
            </div>
          </Link>

          <button
            type="button"
            className="rounded-2xl border border-[var(--line)] bg-white px-3 py-2 text-sm md:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {items.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  isActive(href)
                    ? "bg-[var(--primary-soft)] text-[var(--primary-dark)]"
                    : "text-[var(--muted)] hover:bg-white hover:text-[var(--foreground)]"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* <div className="hidden md:block">
            <Button href="https://ppdb.annasriyah.sch.id" external className="!text-white">
              Daftar PPDB Online
            </Button>
          </div> */}
        </div>

        {open ? (
          <div className="surface mt-3 rounded-[28px] p-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {items.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    isActive(href) ? "bg-[var(--primary-soft)] text-[var(--primary-dark)]" : "text-[var(--muted-foreground)]"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
              {/* <Button href="https://ppdb.annasriyah.sch.id" external className="mt-2 w-full">
                Daftar PPDB Online
              </Button> */}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
