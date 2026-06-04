"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

type Category = {
  id: string;
  name: string;
};

type ActivityInput = {
  id: string;
  title?: string | null;
  excerpt?: string | null;
  content?: any | null;
  coverImage?: string | null;
  status?: string | null;
  categoryId?: string | null;
};

export default function EditForm({
  initial,
  categories,
}: {
  initial: ActivityInput;
  categories: Category[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title ?? "");
  const [excerpt, setExcerpt] = useState(initial.excerpt ?? "");
  const [content, setContent] = useState<any>(initial.content ?? { type: "doc", content: [] });
  const [coverImage, setCoverImage] = useState(initial.coverImage ?? "");
  const [status, setStatus] = useState(initial.status ?? "DRAFT");
  const [categoryId, setCategoryId] = useState(initial.categoryId ?? "");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const response = await fetch(`/api/admin/activities/${initial.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, excerpt, content, coverImage, status, categoryId }),
    });

    setLoading(false);

    if (response.ok) {
      router.push("/admin/kegiatan");
      router.refresh();
      return;
    }

    alert("Gagal memperbarui kegiatan");
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Edit Kegiatan</h1>
      <input className="w-full rounded border p-3" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Judul" required />
      <textarea className="w-full rounded border p-3" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} placeholder="Ringkasan" rows={3} />
      <div className="w-full bg-background rounded-md">
        <RichTextEditor value={content} onChange={setContent} />
      </div>
      <input className="w-full rounded border p-3" value={coverImage} onChange={(event) => setCoverImage(event.target.value)} placeholder="URL cover image" />
      <div className="grid gap-4 md:grid-cols-2">
        <select className="rounded border p-3" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
        </select>
        <select className="rounded border p-3" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="">Pilih kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <button disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-white">
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
