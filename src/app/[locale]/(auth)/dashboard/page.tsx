'use client';

import { useAuth } from '@clerk/nextjs';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { DashboardMetrics } from '@/app-api-clients/dashboard';
import { dashboardApiClient } from '@/app-api-clients/dashboard';
import type { ApiResponse } from '@/app-api-clients/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { IEPOverview } from '@/features/dashboard/IEPOverview';
import { MilestoneOverview } from '@/features/dashboard/MilestoneOverview';
import { StudentOverview } from '@/features/dashboard/StudentOverview';

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Student Overview Skeleton */}
      <div className="space-y-4">
        <div>
          <div className="h-8 w-48 rounded-md bg-muted" />
          <div className="mt-2 h-4 w-96 rounded-md bg-muted" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

function ErrorAlert({ error }: { error: Error }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load dashboard metrics:
        {' '}
        {error.message}
      </AlertDescription>
    </Alert>
  );
}

export default function DashboardPage() {
  const clerkAuth = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<ApiResponse<DashboardMetrics> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!clerkAuth.isLoaded) {
      return;
    }

    if (!clerkAuth.orgId) {
      // router.push('/select-org');
      return;
    }

    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardApiClient.getDashboardMetrics(clerkAuth.orgId);
        setMetrics(data);
        setError(null);
      } catch (e) {
        console.error('Error fetching dashboard metrics:', e);
        setError(e as Error);
        setMetrics(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [clerkAuth.orgId, clerkAuth.isLoaded, router]);

  return (
    <div className="container space-y-8 py-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your school's key metrics
        </p>
      </div>

      {error
        ? (
            <ErrorAlert error={error} />
          )
        : isLoading || !metrics
          ? (
              <DashboardSkeleton />
            )
          : (
              <div className="space-y-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Student Overview</h3>
                    <p className="text-sm text-muted-foreground">
                      Key metrics about your student population
                    </p>
                  </div>
                  <StudentOverview metrics={metrics.data.students} />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Milestone Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      Progress on student milestones and achievements
                    </p>
                  </div>
                  <MilestoneOverview metrics={metrics.data.milestones} />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">IEP Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Individual Education Plan progress and reviews
                    </p>
                  </div>
                  <IEPOverview metrics={metrics.data.ieps} />
                </div>
              </div>
            )}
    </div>
  );
}
