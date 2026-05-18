// src/components/layout/BottomNav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    href: "/dashboard", label: "Home",
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
        stroke={active ? "#00E5A0" : "#4A5568"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
  },
  {
    href: "/training", label: "Plan",
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
        stroke={active ? "#00E5A0" : "#4A5568"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    href: "/shoes", label: "Shoes",
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
        stroke={active ? "#00E5A0" : "#4A5568"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 18l2-8 8 2 4-6h4l2 12H2z"/>
      </svg>
    ),
  },
  {
    href: "/profile", label: "Profile",
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
        stroke={active ? "#00E5A0" : "#4A5568"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto border-t border-border z-50 flex justify-around px-2 py-2 pb-safe"
      style={{ background: "rgba(17,19,24,0.92)", backdropFilter: "blur(20px)" }}
    >
      {NAV.map(({ href, label, icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link key={href} href={href}
            className={`nav-item ${active ? "active" : ""}`}>
            {icon(active)}
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
