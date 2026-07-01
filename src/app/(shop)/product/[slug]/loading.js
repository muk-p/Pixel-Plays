export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] bg-slate-200 h-[420px]" />
          <div className="space-y-4">
            <div className="h-6 w-28 rounded-full bg-slate-200" />
            <div className="h-10 w-3/4 rounded bg-slate-200" />
            <div className="h-6 w-1/2 rounded bg-slate-200" />
            <div className="h-24 rounded-2xl bg-slate-200" />
            <div className="h-12 w-40 rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
