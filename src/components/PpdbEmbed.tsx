"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";

const PPDB_URL = "https://ppdb.annasriyah.sch.id";

export default function PpdbEmbed() {
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!loaded) setTimedOut(true);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [loaded]);

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[32px] border border-[var(--line)] bg-white shadow-[0_20px_50px_rgba(38,86,63,0.1)]">
        <iframe
          src={PPDB_URL}
          title="PPDB Pondok Pesantren Annasriyah"
          className="h-[720px] w-full bg-[var(--secondary)]"
          onLoad={() => setLoaded(true)}
        />
      </div>

      {timedOut ? (
        <Card className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Iframe tidak tampil?</h3>
              <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                Beberapa browser atau jaringan dapat memblokir tampilan iframe. Anda tetap bisa
                membuka portal PPDB secara langsung melalui tombol berikut.
              </p>
            </div>
            <Button href={PPDB_URL} external className="shrink-0">
              Buka PPDB Langsung
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-5 text-sm leading-7 text-[var(--muted-foreground)]">
          Jika portal di atas tidak muncul dengan sempurna, gunakan tombol buka PPDB langsung untuk
          melanjutkan pendaftaran.
        </Card>
      )}
    </div>
  );
}
