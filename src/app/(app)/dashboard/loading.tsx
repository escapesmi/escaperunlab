// src/app/(app)/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="px-5 py-4 flex flex-col gap-5 animate-pulse">
      <div className="flex flex-col gap-1.5">
        <div className="h-4 w-36 rounded-lg bg-surface-alt" />
        <div className="h-7 w-44 rounded-lg bg-surface-alt" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 rounded-2xl bg-surface-alt" />
        <div className="h-24 rounded-2xl bg-surface-alt" />
      </div>
      <div className="h-44 rounded-2xl bg-surface-alt" />
      <div className="h-36 rounded-2xl bg-surface-alt" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-surface-alt" />
        ))}
      </div>
      <div className="h-24 rounded-2xl bg-surface-alt" />
    </div>
  );
}
