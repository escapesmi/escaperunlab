// src/app/(app)/training/workout/[id]/loading.tsx
export default function WorkoutLoading() {
  return (
    <div className="px-5 py-4 flex flex-col gap-5 animate-pulse">
      <div className="h-4 w-20 rounded-lg bg-surface-alt" />
      <div className="h-40 rounded-2xl bg-surface-alt" />
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-surface-alt" />
        ))}
      </div>
      <div className="h-48 rounded-2xl bg-surface-alt" />
      <div className="h-14 rounded-xl bg-surface-alt" />
    </div>
  );
}
