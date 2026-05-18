// src/app/(app)/loading.tsx
export default function Loading() {
  return (
    <div className="px-5 py-4 flex flex-col gap-5 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-4 w-32 rounded-lg bg-surface-alt" />
        <div className="h-7 w-48 rounded-lg bg-surface-alt" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 rounded-2xl bg-surface-alt" />
        <div className="h-24 rounded-2xl bg-surface-alt" />
      </div>

      {/* Chart skeleton */}
      <div className="h-40 rounded-2xl bg-surface-alt" />

      {/* Workout card skeleton */}
      <div className="h-32 rounded-2xl bg-surface-alt" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 rounded-2xl bg-surface-alt" />
        <div className="h-24 rounded-2xl bg-surface-alt" />
        <div className="h-24 rounded-2xl bg-surface-alt" />
        <div className="h-24 rounded-2xl bg-surface-alt" />
      </div>
    </div>
  );
}
