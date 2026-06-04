"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeleteAlbumButton({
  albumId,
  title,
}: {
  albumId: string;
  title: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Hapus album "${title}" beserta semua gambarnya? Aksi ini tidak dapat dibatalkan.`
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/gallery/${albumId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus album.");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menghapus album.");
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
