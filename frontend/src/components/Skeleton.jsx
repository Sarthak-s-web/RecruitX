export function JobCardSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="h-5 w-3/4 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-1/2 rounded bg-slate-200" />
        </div>
        <div className="h-5 w-16 rounded-full bg-slate-200" />
      </div>
      <div className="mt-4 flex gap-4">
        <div className="h-4 w-20 rounded bg-slate-200" />
        <div className="h-4 w-20 rounded bg-slate-200" />
      </div>
      <div className="mt-4 flex gap-1.5">
        <div className="h-5 w-12 rounded-full bg-slate-200" />
        <div className="h-5 w-12 rounded-full bg-slate-200" />
        <div className="h-5 w-12 rounded-full bg-slate-200" />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2">
        <div className="h-3 w-20 rounded bg-slate-200" />
        <div className="h-7 w-24 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="h-10 w-10 rounded-lg bg-slate-200" />
      <div className="mt-3 h-8 w-16 rounded bg-slate-200" />
      <div className="mt-1 h-4 w-24 rounded bg-slate-200" />
    </div>
  );
}

export function ApplicationRowSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-200" />
        <div className="flex-1">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="mt-1.5 h-3 w-40 rounded bg-slate-200" />
        </div>
        <div className="h-5 w-20 rounded-full bg-slate-200" />
      </div>
      <div className="mt-4 h-12 rounded bg-slate-100" />
    </div>
  );
}

export default function JobCardSkeletonList({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}
