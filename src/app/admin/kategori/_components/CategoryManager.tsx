"use client";

import { useMemo, useState } from "react";
import {
  CalendarRange,
  FolderTree,
  ImageIcon,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type CategoryTypeValue = "NEWS" | "ACTIVITY" | "GALLERY";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  type: CategoryTypeValue;
  _count: {
    news: number;
    activities: number;
  };
};

type FeedbackState =
  | {
      kind: "success" | "error";
      text: string;
    }
  | null;

const typeOptions: Array<{ value: CategoryTypeValue; label: string }> = [
  { value: "NEWS", label: "Berita" },
  { value: "ACTIVITY", label: "Kegiatan" },
  { value: "GALLERY", label: "Galeri" },
];

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sortCategories(items: CategoryItem[]) {
  return [...items].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type.localeCompare(b.type);
    }

    return a.name.localeCompare(b.name, "id");
  });
}

function getTypeLabel(type: CategoryTypeValue) {
  return typeOptions.find((item) => item.value === type)?.label || type;
}

function getTypeIcon(type: CategoryTypeValue) {
  if (type === "NEWS") return FolderTree;
  if (type === "ACTIVITY") return CalendarRange;
  return ImageIcon;
}

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: CategoryItem[];
}) {
  const [items, setItems] = useState<CategoryItem[]>(sortCategories(initialCategories));
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | CategoryTypeValue>("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    type: "NEWS" as CategoryTypeValue,
  });

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.slug.toLowerCase().includes(query.toLowerCase());
      const matchesType = typeFilter === "ALL" || item.type === typeFilter;

      return matchesQuery && matchesType;
    });
  }, [items, query, typeFilter]);

  const summary = useMemo(() => {
    return {
      total: items.length,
      news: items.filter((item) => item.type === "NEWS").length,
      activities: items.filter((item) => item.type === "ACTIVITY").length,
      gallery: items.filter((item) => item.type === "GALLERY").length,
    };
  }, [items]);

  function resetForm() {
    setEditingId(null);
    setForm({
      name: "",
      slug: "",
      type: "NEWS",
    });
  }

  function handleEdit(item: CategoryItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      slug: item.slug,
      type: item.type,
    });
    setFeedback(null);
  }

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(
        editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories",
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            slug: slugify(form.slug || form.name),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan kategori.");
      }

      const nextItems = editingId
        ? items.map((item) => (item.id === result.id ? result : item))
        : [result, ...items];

      setItems(sortCategories(nextItems));
      setFeedback({
        kind: "success",
        text: editingId
          ? "Kategori berhasil diperbarui."
          : "Kategori baru berhasil ditambahkan.",
      });
      resetForm();
    } catch (error) {
      setFeedback({
        kind: "error",
        text: error instanceof Error ? error.message : "Terjadi kesalahan.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(item: CategoryItem) {
    const confirmed = window.confirm(
      `Hapus kategori "${item.name}"? Aksi ini tidak dapat dibatalkan.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);
    setFeedback(null);

    try {
      const response = await fetch(`/api/admin/categories/${item.id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus kategori.");
      }

      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      setFeedback({
        kind: "success",
        text: `Kategori "${item.name}" berhasil dihapus.`,
      });

      if (editingId === item.id) {
        resetForm();
      }
    } catch (error) {
      setFeedback({
        kind: "error",
        text: error instanceof Error ? error.message : "Terjadi kesalahan.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Admin / Kategori</p>
          <h1 className="text-2xl font-semibold text-white">CRUD Kategori</h1>
          <p className="mt-1 text-sm text-slate-400">
            Kelola kategori berdasarkan schema: <span className="text-white">name</span>,{" "}
            <span className="text-white">slug</span>, dan <span className="text-white">type</span>.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
          onClick={() => {
            resetForm();
            setFeedback(null);
          }}
        >
          <Plus className="size-4" />
          Tambah Kategori
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
          <CardHeader className="px-5 pt-5">
            <CardDescription>Total Kategori</CardDescription>
            <CardTitle className="text-3xl text-white">{summary.total}</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 text-sm text-slate-500">
            Seluruh kategori yang tersimpan di database.
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
          <CardHeader className="px-5 pt-5">
            <CardDescription>Kategori Berita</CardDescription>
            <CardTitle className="text-3xl text-white">{summary.news}</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 text-sm text-slate-500">
            Dipakai untuk konten berita dan artikel.
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
          <CardHeader className="px-5 pt-5">
            <CardDescription>Kategori Kegiatan</CardDescription>
            <CardTitle className="text-3xl text-white">{summary.activities}</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 text-sm text-slate-500">
            Dipakai untuk kegiatan dan agenda aktivitas.
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
          <CardHeader className="px-5 pt-5">
            <CardDescription>Kategori Galeri</CardDescription>
            <CardTitle className="text-3xl text-white">{summary.gallery}</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 text-sm text-slate-500">
            Dipakai untuk album dan dokumentasi visual.
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
          <CardHeader className="border-b border-white/10 px-5 py-4">
            <CardTitle className="text-white">Daftar Kategori</CardTitle>
            <CardDescription className="text-slate-500">
              Cari, filter, edit, dan hapus kategori dengan cepat.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-5 py-5">
            <div className="grid gap-3 md:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari nama atau slug kategori..."
                  className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-500"
                />
              </div>

              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value as "ALL" | CategoryTypeValue)}
              >
                <SelectTrigger className="w-full border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Filter tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Tipe</SelectItem>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-500">Nama</TableHead>
                  <TableHead className="text-slate-500">Slug</TableHead>
                  <TableHead className="text-slate-500">Tipe</TableHead>
                  <TableHead className="text-slate-500">Dipakai</TableHead>
                  <TableHead className="text-right text-slate-500">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const Icon = getTypeIcon(item.type);
                  const totalUsed = item._count.news + item._count.activities;

                  return (
                    <TableRow key={item.id} className="border-white/10 hover:bg-white/[0.02]">
                      <TableCell className="font-medium text-white">{item.name}</TableCell>
                      <TableCell className="text-slate-400">{item.slug}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-white/10 text-slate-200">
                          <Icon className="size-3.5" />
                          {getTypeLabel(item.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">{totalUsed} konten</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-slate-300 hover:bg-white/5 hover:text-white"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="size-4" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-red-300 hover:bg-red-500/10 hover:text-red-200"
                            disabled={deletingId === item.id}
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 className="size-4" />
                            {deletingId === item.id ? "Menghapus..." : "Hapus"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {filteredItems.length === 0 ? (
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableCell colSpan={5} className="py-10 text-center text-slate-500">
                      Belum ada kategori yang cocok dengan filter saat ini.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
          <CardHeader className="border-b border-white/10 px-5 py-4">
            <CardTitle className="text-white">
              {editingId ? "Edit Kategori" : "Form Kategori"}
            </CardTitle>
            <CardDescription className="text-slate-500">
              Semua field mengikuti schema Prisma model Category.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 px-5 py-5">
            {feedback ? (
              <div
                className={cn(
                  "rounded-xl border px-4 py-3 text-sm",
                  feedback.kind === "success" &&
                    "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
                  feedback.kind === "error" &&
                    "border-red-500/20 bg-red-500/10 text-red-200"
                )}
              >
                {feedback.text}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Contoh: Kegiatan Santri"
                  className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="slug">Slug</Label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        slug: slugify(current.slug || current.name),
                      }))
                    }
                    className="text-xs font-medium text-emerald-300 transition hover:text-emerald-200"
                  >
                    Generate slug
                  </button>
                </div>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      slug: event.target.value,
                    }))
                  }
                  placeholder="kegiatan-santri"
                  className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tipe</Label>
                <Select
                  value={form.type}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      type: value as CategoryTypeValue,
                    }))
                  }
                >
                  <SelectTrigger className="w-full border-white/10 bg-white/5 text-white">
                    <SelectValue placeholder="Pilih tipe kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-lime-500 text-black hover:bg-lime-400"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCcw className="size-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : editingId ? (
                    <>
                      <Pencil className="size-4" />
                      Simpan Perubahan
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" />
                      Tambah Kategori
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
                >
                  Reset Form
                </Button>
              </div>
            </form>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
              <p className="font-medium text-white">Catatan</p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>Slug harus unik untuk setiap kategori.</li>
                <li>Kategori yang masih dipakai berita atau kegiatan tidak bisa dihapus.</li>
                <li>Tipe kategori menentukan relasi konten yang bisa menggunakannya.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
