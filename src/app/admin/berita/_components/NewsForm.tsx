"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { JSONContent } from "@tiptap/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ImagePlus,
  LoaderCircle,
  Newspaper,
  Save,
  ScrollText,
  Trash2,
  X,
} from "lucide-react";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
};

type NewsStatus = "DRAFT" | "PUBLISHED";

type NewsFormData = {
  id?: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  content?: JSONContent | null;
  coverUrl?: string | null;
  status?: NewsStatus | null;
  categoryId?: string | null;
};

const EMPTY_CONTENT: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function NewsForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: NewsFormData;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isEdit = Boolean(initial?.id);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [manualSlug, setManualSlug] = useState(Boolean(initial?.slug));
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState<JSONContent>(
    initial?.content ?? EMPTY_CONTENT
  );
  const [coverUrl] = useState(initial?.coverUrl ?? "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [status, setStatus] = useState<NewsStatus>(initial?.status ?? "DRAFT");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!manualSlug) {
      setSlug(slugify(title));
    }
  }, [manualSlug, title]);

  const coverPreviewUrl = useMemo(() => {
    if (coverFile) {
      return URL.createObjectURL(coverFile);
    }

    if (!removeCover && coverUrl) {
      return coverUrl;
    }

    return null;
  }, [coverFile, coverUrl, removeCover]);

  useEffect(() => {
    if (!coverFile || !coverPreviewUrl?.startsWith("blob:")) {
      return;
    }

    return () => {
      URL.revokeObjectURL(coverPreviewUrl);
    };
  }, [coverFile, coverPreviewUrl]);

  const submitLabel = useMemo(() => {
    if (loading) {
      return isEdit ? "Menyimpan perubahan..." : "Membuat berita...";
    }

    return isEdit ? "Simpan Perubahan" : "Publikasikan Berita";
  }, [isEdit, loading]);

  function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCoverFile(file);
    setRemoveCover(false);
    event.target.value = "";
  }

  function clearSelectedCover() {
    setCoverFile(null);
  }

  function removeExistingCover() {
    setCoverFile(null);
    setRemoveCover(true);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("slug", slug);
      formData.set("excerpt", excerpt);
      formData.set("content", JSON.stringify(content));
      formData.set("status", status);
      formData.set("categoryId", categoryId);
      formData.set("removeCover", String(removeCover));

      if (coverFile) {
        formData.set("coverImage", coverFile);
      }

      const response = await fetch(
        isEdit ? `/api/admin/news/${initial?.id}` : "/api/admin/news",
        {
          method: isEdit ? "PUT" : "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan berita.");
      }

      router.push("/admin/berita");
      router.refresh();
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Gagal menyimpan berita."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 py-5 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Admin / Berita</p>
            <h1 className="text-2xl font-semibold text-white">
              {isEdit ? "Edit Berita" : "Tulis Berita Baru"}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Kelola berita dengan editor Tiptap dan simpan konten sebagai JSON.
            </p>
          </div>
          <Link
            href="/admin/berita"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
            )}
          >
            <ArrowLeft className="size-4" />
            Kembali ke daftar
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
            <CardHeader className="border-b border-white/10 px-5 py-4">
              <CardTitle className="text-white">Form Berita</CardTitle>
              <CardDescription className="text-slate-500">
                Lengkapi metadata berita lalu tulis isi artikel menggunakan editor.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 py-5">
              <form onSubmit={onSubmit} className="space-y-5">
                {feedback ? (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {feedback}
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="title">Judul Berita</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Contoh: Santri Raih Juara Nasional"
                    className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                    required
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(event) => {
                        setManualSlug(true);
                        setSlug(slugify(event.target.value));
                      }}
                      placeholder="santri-raih-juara-nasional"
                      className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                      required
                    />
                    <p className="text-xs text-slate-500">
                      Dipakai pada URL berita dan harus unik.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverImage">Cover Berita</Label>
                    <input
                      ref={fileInputRef}
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverChange}
                    />

                    <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-4">
                      {coverPreviewUrl ? (
                        <div className="space-y-3">
                          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={coverPreviewUrl}
                              alt="Preview cover berita"
                              className="h-44 w-full object-cover"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <ImagePlus className="size-4" />
                              {coverFile ? "Ganti file" : "Ganti cover"}
                            </Button>
                            {coverFile ? (
                              <Button
                                type="button"
                                variant="ghost"
                                className="text-slate-300 hover:bg-white/5 hover:text-white"
                                onClick={clearSelectedCover}
                              >
                                <X className="size-4" />
                                Batalkan file baru
                              </Button>
                            ) : coverUrl && !removeCover ? (
                              <Button
                                type="button"
                                variant="ghost"
                                className="text-red-300 hover:bg-red-500/10 hover:text-red-200"
                                onClick={removeExistingCover}
                              >
                                <Trash2 className="size-4" />
                                Hapus cover
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex h-44 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-slate-500">
                            Belum ada cover dipilih
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <ImagePlus className="size-4" />
                            Upload cover
                          </Button>
                        </div>
                      )}
                      <p className="mt-3 text-xs text-slate-500">
                        Upload 1 gambar cover. Format gambar umum didukung, maksimal 10MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Ringkasan</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(event) => setExcerpt(event.target.value)}
                    placeholder="Ringkasan singkat berita..."
                    rows={4}
                    className="min-h-[110px] border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                    required
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={status}
                      onValueChange={(value) =>
                        setStatus((value as NewsStatus | null) ?? "DRAFT")
                      }
                    >
                      <SelectTrigger className="w-full border-white/10 bg-white/5 text-white">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">DRAFT</SelectItem>
                        <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Select
                      value={categoryId}
                      onValueChange={(value) => setCategoryId(value ?? "")}
                    >
                      <SelectTrigger className="w-full border-white/10 bg-white/5 text-white">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tanpa kategori</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Konten Berita</Label>
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Tulis isi berita di sini..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-lime-500 text-black hover:bg-lime-400"
                  >
                    {loading ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    {submitLabel}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
            <CardHeader className="border-b border-white/10 px-5 py-4">
              <CardTitle className="text-white">Panduan Konten</CardTitle>
              <CardDescription className="text-slate-500">
                Ringkasan field penting agar alur publikasi tetap rapi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-5 py-5 text-sm text-slate-300">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-white">
                  <Newspaper className="size-4 text-lime-400" />
                  <span className="font-medium">Metadata</span>
                </div>
                <p className="text-slate-400">
                  Gunakan judul jelas, slug pendek, dan ringkasan singkat untuk kartu berita.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-white">
                  <ScrollText className="size-4 text-lime-400" />
                  <span className="font-medium">Konten JSON</span>
                </div>
                <p className="text-slate-400">
                  Editor menyimpan struktur Tiptap ke database sebagai JSON, bukan HTML mentah.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">Status publikasi</p>
                <p className="mt-2 text-slate-400">
                  Simpan sebagai draft untuk review internal, lalu ubah ke published saat siap tayang.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
