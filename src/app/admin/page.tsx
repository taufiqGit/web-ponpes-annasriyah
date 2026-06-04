import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  Folder,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const [newsCount, activityCount, galleryCount, agendaCount] = await Promise.all([
    prisma.news.count(),
    prisma.activity.count(),
    prisma.galleryAlbum.count(),
    prisma.agenda.count(),
  ]);

  const stats = [
    {
      label: "Total Berita",
      value: newsCount.toLocaleString("id-ID"),
      highlight: "+12.5%",
      title: "Pembaruan konten bulan ini",
      helper: "Publikasi berita aktif dan siap ditayangkan",
      icon: Newspaper,
    },
    {
      label: "Total Kegiatan",
      value: activityCount.toLocaleString("id-ID"),
      highlight: "-20%",
      title: "Agenda yang perlu ditindaklanjuti",
      helper: "Koordinasi kegiatan pekanan dan kalender acara",
      icon: CalendarDays,
    },
    {
      label: "Total Galeri",
      value: galleryCount.toLocaleString("id-ID"),
      highlight: "+12.5%",
      title: "Dokumentasi santri terbarui",
      helper: "Aset visual untuk website dan materi publikasi",
      icon: Folder,
    },
    {
      label: "Agenda Pekanan",
      value: `${agendaCount}%`,
      highlight: "+4.5%",
      title: "Stabil dan terjaga",
      helper: "Alur kegiatan rutin berjalan sesuai target",
      icon: BriefcaseBusiness,
    },
  ];

  const chartPointsTop = "0,70 80,135 160,150 240,118 320,72 400,48 480,58 560,102 640,150 720,142 800,92";
  const chartPointsBottom = "0,108 80,142 160,152 240,136 320,118 400,96 480,86 560,98 640,132 720,146 800,116";

  const documentRows = [
    {
      title: "Struktur Profil Pesantren",
      type: "Halaman Profil",
      status: "Diproses",
      target: "Profil utama",
      limit: "Hari ini",
      reviewer: session.user?.name || "Admin",
    },
    {
      title: "Draft Berita Kegiatan Santri",
      type: "Berita",
      status: "Selesai",
      target: "Beranda",
      limit: "Besok",
      reviewer: session.user?.name || "Admin",
    },
    {
      title: "Pembaruan Program Unggulan",
      type: "Program",
      status: "Selesai",
      target: "Program",
      limit: "Minggu ini",
      reviewer: session.user?.name || "Admin",
    },
    {
      title: "Kurasi Foto Galeri Semester",
      type: "Galeri",
      status: "Diproses",
      target: "Galeri",
      limit: "Minggu ini",
      reviewer: session.user?.name || "Admin",
    },
    {
      title: "Sinkronisasi Jadwal Agenda",
      type: "Agenda",
      status: "Review",
      target: "Dashboard",
      limit: "Jumat",
      reviewer: session.user?.name || "Admin",
    },
  ];

  return (
    <div className="space-y-5 px-4 py-5 md:px-6 lg:px-8">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Dashboard admin</p>
          <h1 className="text-xl font-semibold text-white">Documents</h1>
        </div>
        <Button
          className="w-full bg-lime-500 text-black hover:bg-lime-400 md:w-auto"
        >
          <Sparkles className="size-4" />
          Quick Create
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <Card
                    key={stat.label}
                    className="border-white/10 bg-[#0b0b0b] py-0 shadow-none"
                  >
                    <CardHeader className="px-5 pt-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardDescription className="text-sm text-slate-500">
                            {stat.label}
                          </CardDescription>
                          <CardTitle className="mt-3 text-4xl font-semibold text-white">
                            {stat.value}
                          </CardTitle>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-white/10 bg-white/5 text-slate-200"
                        >
                          <ArrowUpRight className="size-3.5" />
                          {stat.highlight}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 px-5 pb-5">
                      <div className="flex items-center gap-2 text-sm font-medium text-white">
                        <Icon className="size-4 text-lime-400" />
                        {stat.title}
                      </div>
                      <p className="text-sm text-slate-500">{stat.helper}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Tabs defaultValue="3-months" className="space-y-4">
              <Card className="overflow-hidden border-white/10 bg-[#0b0b0b] py-0 shadow-none">
                <CardHeader className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <CardTitle className="text-white">Total Visitors</CardTitle>
                    <CardDescription className="text-slate-500">
                      Total untuk 3 bulan terakhir
                    </CardDescription>
                  </div>
                  <TabsList className="h-auto gap-1 rounded-xl border border-white/10 bg-transparent p-1">
                    <TabsTrigger
                      value="3-months"
                      className="rounded-lg px-3 py-1.5 text-xs text-slate-400 data-active:bg-white data-active:text-black"
                    >
                      Last 3 months
                    </TabsTrigger>
                    <TabsTrigger
                      value="30-days"
                      className="rounded-lg px-3 py-1.5 text-xs text-slate-400 data-active:bg-white data-active:text-black"
                    >
                      Last 30 days
                    </TabsTrigger>
                    <TabsTrigger
                      value="7-days"
                      className="rounded-lg px-3 py-1.5 text-xs text-slate-400 data-active:bg-white data-active:text-black"
                    >
                      Last 7 days
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                {["3-months", "30-days", "7-days"].map((tab) => (
                  <TabsContent key={tab} value={tab}>
                    <CardContent className="px-4 pb-4 pt-5 md:px-5">
                      <div className="rounded-2xl border border-white/5 bg-[linear-gradient(180deg,rgba(22,22,22,1),rgba(10,10,10,1))] p-4">
                        <div className="relative h-[320px] overflow-hidden rounded-xl">
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:80px_64px]" />
                          <svg
                            viewBox="0 0 800 220"
                            className="absolute inset-x-0 bottom-0 h-[85%] w-full"
                            preserveAspectRatio="none"
                          >
                            <defs>
                              <linearGradient id="annasriyahTopFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(132,204,22,0.55)" />
                                <stop offset="100%" stopColor="rgba(132,204,22,0.02)" />
                              </linearGradient>
                              <linearGradient id="annasriyahBottomFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(132,204,22,0.35)" />
                                <stop offset="100%" stopColor="rgba(132,204,22,0.01)" />
                              </linearGradient>
                            </defs>
                            <path
                              d={`M0,220 L${chartPointsTop.replaceAll(" ", " L")} L800,220 Z`}
                              fill="url(#annasriyahTopFill)"
                            />
                            <path
                              d={`M0,220 L${chartPointsBottom.replaceAll(" ", " L")} L800,220 Z`}
                              fill="url(#annasriyahBottomFill)"
                            />
                            <polyline
                              fill="none"
                              stroke="#84cc16"
                              strokeWidth="2"
                              points={chartPointsTop}
                            />
                            <polyline
                              fill="none"
                              stroke="rgba(132,204,22,0.65)"
                              strokeWidth="1.6"
                              points={chartPointsBottom}
                            />
                          </svg>

                          <div className="absolute inset-x-4 bottom-3 grid grid-cols-6 text-[11px] text-slate-600 md:inset-x-8">
                            {["Jun 24", "Jun 25", "Jun 26", "Jun 27", "Jun 28", "Jun 29"].map((label) => (
                              <span key={label}>{label}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </TabsContent>
                ))}
              </Card>
            </Tabs>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                Outline
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-white/5 hover:text-white">
                Past Performance
                <Badge variant="secondary" className="ml-1 bg-white/10 text-slate-200">3</Badge>
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-white/5 hover:text-white">
                Key Personnel
                <Badge variant="secondary" className="ml-1 bg-white/10 text-slate-200">2</Badge>
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-white/5 hover:text-white">
                Focus Documents
              </Button>
            </div>

            <Card className="overflow-hidden border-white/10 bg-[#0b0b0b] py-0 shadow-none">
              <CardHeader className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-white">Dokumen & Konten Prioritas</CardTitle>
                  <CardDescription className="text-slate-500">
                    Ringkasan pekerjaan editorial dan publikasi yang sedang berjalan.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/admin/berita"
                    className={buttonVariants({
                      variant: "outline",
                      className:
                        "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white",
                    })}
                  >
                    Customize Columns
                  </Link>
                  <Link
                    href="/admin/berita"
                    className={buttonVariants({
                      className: "bg-white text-black hover:bg-slate-200",
                    })}
                  >
                    <ArrowRight className="size-4" />
                    Add Section
                  </Link>
                </div>
              </CardHeader>
              {/* <CardContent className="px-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="px-5 text-slate-500">Header</TableHead>
                      <TableHead className="text-slate-500">Section Type</TableHead>
                      <TableHead className="text-slate-500">Status</TableHead>
                      <TableHead className="text-slate-500">Target</TableHead>
                      <TableHead className="text-slate-500">Limit</TableHead>
                      <TableHead className="text-slate-500">Reviewer</TableHead>
                      <TableHead className="pr-5 text-right text-slate-500">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentRows.map((row) => (
                      <TableRow key={row.title} className="border-white/10 hover:bg-white/[0.02]">
                        <TableCell className="px-5 py-4">
                          <div className="space-y-1">
                            <p className="font-medium text-white">{row.title}</p>
                            <p className="text-xs text-slate-500">Drag to reorder</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">{row.type}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "border-white/10",
                              row.status === "Selesai" && "bg-lime-500/10 text-lime-300",
                              row.status === "Diproses" && "bg-amber-500/10 text-amber-300",
                              row.status === "Review" && "bg-sky-500/10 text-sky-300"
                            )}
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400">{row.target}</TableCell>
                        <TableCell className="text-slate-400">{row.limit}</TableCell>
                        <TableCell className="text-slate-300">{row.reviewer}</TableCell>
                        <TableCell className="pr-5 text-right">
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-white/5 hover:text-white">
                            Open menu
                            <ChevronRight className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent> */}
            </Card>
          </div>
  );
}
