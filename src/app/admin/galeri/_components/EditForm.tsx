"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarIcon, ImagePlus, LoaderCircle, Save, Trash2, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type GalleryImage = {
  id: string;
  imageUrl: string;
  caption?: string | null;
};

type GalleryInput = {
  id: string;
  title: string;
  description?: string | null;
  status: "DRAFT" | "PUBLISHED";
  eventDate?: string | null;
  images: GalleryImage[];
};

function parseDateValue(value: string) {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

function formatDateValue(date?: Date) {
  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateLabel(value: string) {
  const date = parseDateValue(value);

  if (!date) {
    return "Pilih tanggal album";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
}

export default function EditForm({
  item,
}: {
  item?: GalleryInput;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(item?.status ?? "DRAFT");
  const [eventDate, setEventDate] = useState(item?.eventDate ?? "");
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [removeImageIds, setRemoveImageIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [timeZone, setTimeZone] = useState<string>();

  const existingImages = item?.images ?? [];
  const remainingExistingImages = existingImages.filter(
    (image) => !removeImageIds.includes(image.id)
  );
  const totalAfterSave = remainingExistingImages.length + newFiles.length;
  const selectedEventDate = useMemo(() => parseDateValue(eventDate), [eventDate]);

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  function toggleRemoveImage(imageId: string) {
    setRemoveImageIds((current) =>
      current.includes(imageId)
        ? current.filter((id) => id !== imageId)
        : [...current, imageId]
    );
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    setNewFiles((current) => {
      const existingKeys = new Set(
        current.map((file) => `${file.name}-${file.size}-${file.lastModified}`)
      );

      const mergedFiles = [...current];

      for (const file of selectedFiles) {
        const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
        if (!existingKeys.has(fileKey)) {
          mergedFiles.push(file);
          existingKeys.add(fileKey);
        }
      }

      return mergedFiles;
    });

    event.target.value = "";
  }

  function removeNewFile(targetFile: File) {
    setNewFiles((current) =>
      current.filter(
        (file) =>
          !(
            file.name === targetFile.name &&
            file.size === targetFile.size &&
            file.lastModified === targetFile.lastModified
          )
      )
    );
  }

  async function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);

    if (totalAfterSave <= 0) {
      setLoading(false);
      setFeedback("Album harus memiliki minimal satu gambar.");
      return;
    }

    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("description", description);
      formData.set("status", status);
      formData.set("eventDate", eventDate);
      formData.set("removeImageIds", JSON.stringify(removeImageIds));

      for (const file of newFiles) {
        formData.append("images", file);
      }

      const response = await fetch(item ? `/api/admin/gallery/${item.id}` : "/api/admin/gallery", {
        method: item ? "PATCH" : "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan album.");
      }

      router.push("/admin/galeri");
      router.refresh();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Gagal menyimpan album.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black px-4 py-5 text-slate-100 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Admin / Galeri</p>
            <h1 className="text-2xl font-semibold text-white">
              {item ? "Edit Album Galeri" : "Album Galeri Baru"}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Unggah banyak gambar sekaligus ke Supabase Storage untuk satu album.
            </p>
          </div>
          <Link
            href="/admin/galeri"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
            )}
          >
            Kembali ke daftar
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
            <CardHeader className="border-b border-white/10 px-5 py-4">
              <CardTitle className="text-white">Form Album</CardTitle>
              <CardDescription className="text-slate-500">
                Isi metadata album lalu unggah foto dokumentasi sebanyak yang dibutuhkan.
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
                  <Label htmlFor="title">Judul Album</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Contoh: Wisuda Santri 2026"
                    className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Tulis ringkasan dokumentasi album..."
                    rows={5}
                    className="flex min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={status}
                      onValueChange={(value) => setStatus(value as "DRAFT" | "PUBLISHED")}
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
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor="eventDate">Tanggal Album</Label>
                      {eventDate ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setEventDate("")}
                          className="text-slate-300 hover:bg-white/5 hover:text-white"
                        >
                          Reset
                        </Button>
                      ) : null}
                    </div>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-full justify-start border-white/10 bg-white/5 text-left font-normal text-white",
                              !eventDate && "text-slate-500"
                            )}
                          >
                            <CalendarIcon className="size-4" />
                            {formatDateLabel(eventDate)}
                          </Button>
                        }
                      />
                      <PopoverContent
                        align="start"
                        sideOffset={8}
                        className="w-auto border border-white/10 bg-[#0b0b0b] p-3 text-slate-100"
                      >
                        <Calendar
                          id="eventDate"
                          mode="single"
                          selected={selectedEventDate}
                          onSelect={(date) => {
                            setEventDate(formatDateValue(date));
                            setCalendarOpen(false);
                          }}
                          captionLayout="dropdown"
                          timeZone={timeZone}
                          className="rounded-lg"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Upload Gambar</Label>
                  <Input
                    id="images"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="border-white/10 bg-white/5 text-white file:mr-3 file:rounded-lg file:border-0 file:bg-lime-500 file:px-3 file:py-2 file:text-sm file:font-medium file:text-black"
                  />
                  <p className="text-xs text-slate-500">
                    Bisa pilih banyak file sekaligus. Di Mac pakai Command, di Windows pakai Ctrl. Maksimal 10MB per file.
                  </p>
                </div>

                {newFiles.length > 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-white">
                        File baru ({newFiles.length})
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setNewFiles([])}
                        className="text-slate-300 hover:bg-white/5 hover:text-white"
                      >
                        <Trash2 className="size-4" />
                        Kosongkan
                      </Button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {newFiles.map((file) => (
                        <button
                          key={`${file.name}-${file.size}`}
                          type="button"
                          onClick={() => removeNewFile(file)}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-white/5"
                        >
                          <ImagePlus className="size-3.5" />
                          {file.name}
                          <X className="size-3.5 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-lime-500 text-black hover:bg-lime-400"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="size-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="size-4" />
                        {item ? "Simpan Perubahan" : "Buat Album"}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setNewFiles([]);
                      setRemoveImageIds([]);
                      setFeedback(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
                  >
                    <Trash2 className="size-4" />
                    Reset Pilihan Gambar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
              <CardHeader className="border-b border-white/10 px-5 py-4">
                <CardTitle className="text-white">Ringkasan</CardTitle>
                <CardDescription className="text-slate-500">
                  Perkiraan jumlah gambar setelah disimpan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 px-5 py-5 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Gambar tersisa</span>
                  <span>{remainingExistingImages.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Gambar baru</span>
                  <span>{newFiles.length}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-3 font-medium text-white">
                  <span>Total setelah simpan</span>
                  <span>{totalAfterSave}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#0b0b0b] py-0 shadow-none">
              <CardHeader className="border-b border-white/10 px-5 py-4">
                <CardTitle className="text-white">Gambar Saat Ini</CardTitle>
                <CardDescription className="text-slate-500">
                  Tandai gambar yang ingin dihapus dari album.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 py-5">
                {existingImages.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-500">
                    Belum ada gambar tersimpan. Tambahkan file baru untuk membuat album ini aktif.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {existingImages.map((image) => {
                      const markedForDelete = removeImageIds.includes(image.id);

                      return (
                        <label
                          key={image.id}
                          className={`overflow-hidden rounded-2xl border ${
                            markedForDelete
                              ? "border-red-500/40 bg-red-500/10"
                              : "border-white/10 bg-white/[0.03]"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image.imageUrl}
                            alt={image.caption || title || "Gambar galeri"}
                            className="h-40 w-full object-cover"
                          />
                          <div className="space-y-3 p-4">
                            <p className="line-clamp-2 text-sm text-slate-300">
                              {image.caption || "Tanpa caption"}
                            </p>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs text-slate-500">
                                {markedForDelete
                                  ? "Akan dihapus saat disimpan"
                                  : "Tetap dipertahankan"}
                              </span>
                              <span className="inline-flex items-center gap-2 text-sm text-white">
                                <input
                                  type="checkbox"
                                  checked={markedForDelete}
                                  onChange={() => toggleRemoveImage(image.id)}
                                  className="size-4 rounded border-white/20 bg-transparent"
                                />
                                Hapus
                              </span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
