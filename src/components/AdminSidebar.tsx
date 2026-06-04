"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CircleDot,
  Folder,
  Newspaper,
  Sparkles,
} from "lucide-react";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import { cn } from "@/lib/utils";

const sidebarMain = [
  { label: "Home", href: "/admin", icon: BookOpen },
  { label: "Kategori", href: "/admin/kategori", icon: Sparkles },
  { label: "Berita", href: "/admin/berita", icon: Newspaper },
  { label: "Gallery", href: "/admin/galeri", icon: Folder },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-white/10 bg-[#080808] lg:block">
      <div className="flex h-full flex-col px-5 py-5">
        <div className="flex items-center gap-2 border-b border-white/10 pb-5">
          <div className="flex size-8 items-center justify-center rounded-full bg-white/10">
            <CircleDot className="size-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Annasriyah</p>
            <p className="text-xs text-slate-500">Admin Console</p>
          </div>
        </div>

        <div className="flex h-full flex-col py-5">
          <nav className="space-y-1.5">
            {sidebarMain.map((item) => {
              const Icon = item.icon;
              // Add simple active state check
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-white/5 hover:text-white",
                    isActive ? "bg-white/10 text-white font-medium" : "text-slate-400"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 [&_button]:w-full [&_button]:justify-start">
            <AdminLogoutButton />
          </div>
        </div>
      </div>
    </aside>
  );
}
