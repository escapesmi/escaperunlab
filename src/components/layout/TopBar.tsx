// src/components/layout/TopBar.tsx
"use client";
import Link from "next/link";
import Image from "next/image";

interface Props {
  name?: string;
  avatarUrl?: string;
}

export default function TopBar({ name, avatarUrl }: Props) {
  const initials = (name || "R")[0].toUpperCase();
  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border/50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="#000">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
          </svg>
        </div>
        <span className="font-display text-lg tracking-widest text-text-primary">
          ESCAPE RUN LAB
        </span>
      </div>

      {/* Date + Avatar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-text-muted hidden sm:block">{dateStr}</span>
        <Link href="/profile">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-accent to-info flex items-center justify-center cursor-pointer ring-2 ring-border hover:ring-accent transition-all">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={name || "User"} width={36} height={36} className="object-cover" />
            ) : (
              <span className="font-bold text-sm text-black">{initials}</span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
