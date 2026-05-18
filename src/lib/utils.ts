// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format pace seconds to "M:SS" string */
export function formatPace(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

/** Parse "M:SS" pace string to total seconds */
export function parsePace(pace: string): number {
  const [min, sec] = pace.split(":").map(Number);
  return (min ?? 0) * 60 + (sec ?? 0);
}

/** Format a date to Indonesian locale string */
export function formatDateID(date: string | Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

/** Format a short date */
export function formatDateShort(date: string | Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric", month: "short",
  });
}

/** Calculate percentage safely */
export function pct(value: number, max: number): number {
  if (max === 0) return 0;
  return Math.min(Math.round((value / max) * 100), 100);
}

/** Get a greeting based on time of day */
export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Selamat pagi";
  if (h < 17) return "Selamat siang";
  if (h < 20) return "Selamat sore";
  return "Selamat malam";
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
