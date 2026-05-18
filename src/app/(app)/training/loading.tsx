// src/app/(app)/training/loading.tsx
export default function TrainingLoading() {
  return (
    <div className="px-5 py-4 flex flex-col gap-5 animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-7 w-40 rounded-lg bg-surface-alt" />
        <div className="h-4 w-56 rounded-lg bg-surface-alt" />
      </div>
      {/* Week pills */}
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 w-14 rounded-xl bg-surface-alt flex-shrink-0" />
        ))}
      </div>
      {/* Week summary */}
      <div className="h-24 rounded-2xl bg-surface-alt" />
      {/* Workout rows */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 rounded-2xl bg-surface-alt" />
      ))}
    </div>
  );
}
