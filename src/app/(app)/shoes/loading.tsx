// src/app/(app)/shoes/loading.tsx
export default function ShoesLoading() {
  return (
    <div className="px-5 py-4 flex flex-col gap-5 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-36 rounded-lg bg-surface-alt" />
          <div className="h-4 w-48 rounded-lg bg-surface-alt" />
        </div>
        <div className="h-10 w-24 rounded-xl bg-surface-alt" />
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="h-44 rounded-2xl bg-surface-alt" />
      ))}
    </div>
  );
}
