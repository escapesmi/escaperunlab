// src/app/(app)/profile/loading.tsx
export default function ProfileLoading() {
  return (
    <div className="px-5 py-4 flex flex-col gap-5 animate-pulse">
      {/* Avatar card */}
      <div className="h-52 rounded-2xl bg-surface-alt" />
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-surface-alt" />
        ))}
      </div>
      {/* Plan + Physical */}
      <div className="h-32 rounded-2xl bg-surface-alt" />
      <div className="h-52 rounded-2xl bg-surface-alt" />
      {/* Sign out */}
      <div className="h-14 rounded-xl bg-surface-alt" />
    </div>
  );
}
