// src/app/onboarding/loading.tsx
export default function OnboardingLoading() {
  return (
    <div className="min-h-screen px-6 py-8 max-w-md mx-auto animate-pulse">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-surface-alt" />
        <div className="h-5 w-32 rounded-lg bg-surface-alt" />
      </div>
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <div className="h-3 w-20 rounded bg-surface-alt" />
          <div className="h-3 w-8 rounded bg-surface-alt" />
        </div>
        <div className="h-1 bg-surface-alt rounded-full" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-8 w-64 rounded-lg bg-surface-alt" />
        <div className="h-5 w-48 rounded-lg bg-surface-alt" />
        <div className="h-12 rounded-xl bg-surface-alt" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-12 rounded-xl bg-surface-alt" />
          <div className="h-12 rounded-xl bg-surface-alt" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-12 rounded-xl bg-surface-alt" />
          <div className="h-12 rounded-xl bg-surface-alt" />
        </div>
      </div>
      <div className="mt-8">
        <div className="h-14 rounded-xl bg-surface-alt" />
      </div>
    </div>
  );
}
