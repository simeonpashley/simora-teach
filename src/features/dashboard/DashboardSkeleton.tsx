import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Student Overview Skeleton */}
      <div className="space-y-4">
        <div>
          <div className="h-8 w-48 rounded-md bg-muted" />
          <div className="mt-2 h-4 w-96 rounded-md bg-muted" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-testid="skeleton-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-card p-6 shadow-sm"
              data-testid="metric-card-skeleton"
            >
              <Skeleton className="h-7 w-[120px]" />
              <Skeleton className="mt-4 h-10 w-[60px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Milestone Overview Skeleton */}
      <div className="space-y-4">
        <div>
          <div className="h-8 w-48 rounded-md bg-muted" />
          <div className="mt-2 h-4 w-96 rounded-md bg-muted" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="skeleton-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-card p-6 shadow-sm"
              data-testid="metric-card-skeleton"
            >
              <Skeleton className="h-7 w-[120px]" />
              <Skeleton className="mt-4 h-10 w-[60px]" />
            </div>
          ))}
        </div>
      </div>

      {/* IEP Overview Skeleton */}
      <div className="space-y-4">
        <div>
          <div className="h-8 w-48 rounded-md bg-muted" />
          <div className="mt-2 h-4 w-96 rounded-md bg-muted" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="skeleton-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-card p-6 shadow-sm"
              data-testid="metric-card-skeleton"
            >
              <Skeleton className="h-7 w-[120px]" />
              <Skeleton className="mt-4 h-10 w-[60px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Planning Overview Skeleton */}
      <div className="space-y-4">
        <div>
          <div className="h-8 w-48 rounded-md bg-muted" />
          <div className="mt-2 h-4 w-96 rounded-md bg-muted" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="skeleton-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-card p-6 shadow-sm"
              data-testid="metric-card-skeleton"
            >
              <Skeleton className="h-7 w-[120px]" />
              <Skeleton className="mt-4 h-10 w-[60px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Communication Overview Skeleton */}
      <div className="space-y-4">
        <div>
          <div className="h-8 w-48 rounded-md bg-muted" />
          <div className="mt-2 h-4 w-96 rounded-md bg-muted" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="skeleton-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-card p-6 shadow-sm"
              data-testid="metric-card-skeleton"
            >
              <Skeleton className="h-7 w-[120px]" />
              <Skeleton className="mt-4 h-10 w-[60px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
