"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeleteNewsButton({
  newsId,
  title,
}: {
  newsId: string;
  title: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Hapus berita "${title}"? Aksi ini tidak dapat dibatalkan.`
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/news/${newsId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus berita.");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menghapus berita.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-300 hover:bg-red-500/10 hover:text-red-200"
    >
      <Trash2 className="size-4" />
      {loading ? "Menghapus..." : "Hapus"}
    </Button>
  );
}
