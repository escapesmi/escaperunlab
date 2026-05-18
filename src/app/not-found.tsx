// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-5">
      <div className="font-display text-8xl text-accent">404</div>
      <div>
        <h2 className="text-xl font-bold mb-2">Halaman tidak ditemukan</h2>
        <p className="text-text-secondary text-sm">
          Halaman yang kamu cari tidak ada atau sudah dipindah.
        </p>
      </div>
      <Link href="/dashboard" className="btn-primary">
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
