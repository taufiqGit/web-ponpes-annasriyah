import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

const sansFont = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Pondok Pesantren Annasriyah",
    template: "%s | Pondok Pesantren Annasriyah",
  },
  description:
    "Website resmi Pondok Pesantren Annasriyah, Brabo, Tanggungharjo, Grobogan, Jawa Tengah.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${sansFont.variable} bg-[var(--background)] font-sans text-[var(--foreground)] antialiased`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
