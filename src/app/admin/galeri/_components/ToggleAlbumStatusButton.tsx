"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type AlbumStatus = "DRAFT" | "PUBLISHED";

export default function ToggleAlbumStatusButton({
  albumId,
  status,
}: {
  albumId: string;
  status: AlbumStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const nextStatus: AlbumStatus = status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
  const isPublished = status === "PUBLISHED";

  async function handleToggleStatus() {
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/gallery/${albumId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Gagal mengubah status album.");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal mengubah status album.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      onClick={handleToggleStatus}
      disabled={loading}
      className="text-slate-300 hover:bg-white/5 hover:text-white"
    >
      {isPublished ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      {loading ? "Menyimpan..." : isPublished ? "Jadikan Draft" : "Publish"}
    </Button>
  );
}
