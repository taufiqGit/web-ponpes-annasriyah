import Image from "next/image";

export default function WhatsAppFloat() {
  const text = encodeURIComponent(
    ""
  );

  return (
    <a
      href={`https://wa.me/6285796106086?text=${text}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Hubungi via WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full bg-[var(--primary-dark)] px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(47,126,90,0.28)] transition hover:-translate-y-1"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg">
        <Image src="/uploads/whatsapp.png" alt="WhatsApp" width={24} height={24} />
      </span>
      <span className="hidden sm:inline !text-white">Hubungi Kami</span>
    </a>
  );
}
