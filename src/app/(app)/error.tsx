// src/app/(app)/error.tsx
"use client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-5">
      <div className="text-5xl">😵</div>
      <div>
        <h2 className="text-xl font-bold mb-2">Ada yang error nih</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
          {error.message ?? "Terjadi kesalahan yang tidak terduga. Coba lagi ya."}
        </p>
      </div>
      <button className="btn-primary" onClick={reset}>
        Coba Lagi
      </button>
    </div>
  );
}
