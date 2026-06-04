"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AgendaItem = {
  id: string;
  day: string;
  date?: string | null;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  badge: "Pengajian" | "Olahraga" | "Lomba" | "Kunjungan" | "Lainnya";
  status: "DRAFT" | "PUBLISHED";
};

type AgendaPayload = {
  day: string;
  date?: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  badge: AgendaItem["badge"];
  status: AgendaItem["status"];
};

function normalizeDate(value?: string | null) {
  if (!value) return "";

  try {
    const date = new Date(value);
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    )
      .toISOString()
      .slice(0, 10);
  } catch {
    return "";
  }
}

export default function EditAgendaForm({ initial }: { initial: AgendaItem }) {
  const router = useRouter();
  const [day, setDay] = useState(initial.day || "");
  const [date, setDate] = useState(() => normalizeDate(initial.date));
  const [startTime, setStartTime] = useState(() => (initial.startTime || "").replace(".", ":"));
  const [endTime, setEndTime] = useState(() => (initial.endTime || "").replace(".", ":"));
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [badge, setBadge] = useState<AgendaItem["badge"]>(initial.badge || "Pengajian");
  const [status, setStatus] = useState<AgendaItem["status"]>(initial.status || "PUBLISHED");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload: AgendaPayload = {
      day,
      date: date ? new Date(date).toISOString() : undefined,
      startTime: startTime ? startTime.replace(":", ".") : "",
      endTime: endTime ? endTime.replace(":", ".") : "",
      title,
      description,
      badge,
      status,
    };
    const res = await fetch(`/api/admin/agenda/${initial.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) router.push("/admin/agenda");
    else alert("Gagal memperbarui agenda");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Hari</label>
          <select className="border p-2 rounded w-full" value={day} onChange={(e) => setDay(e.target.value)} required>
            {["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Tanggal</label>
          <input type="date" className="border p-2 rounded w-full" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Mulai</label>
          <input type="time" className="border p-2 rounded w-full" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Selesai</label>
          <input type="time" className="border p-2 rounded w-full" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Judul</label>
        <input className="border p-2 rounded w-full font-semibold" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm mb-1">Deskripsi</label>
        <textarea className="border p-2 rounded w-full" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Badge</label>
          <select
            className="border p-2 rounded w-full"
            value={badge}
            onChange={(e) => setBadge(e.target.value as AgendaItem["badge"])}
          >
            {["Pengajian","Olahraga","Lomba","Kunjungan","Lainnya"].map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Status</label>
          <select
            className="border p-2 rounded w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value as AgendaItem["status"])}
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
          </select>
        </div>
      </div>
      <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
