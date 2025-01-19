import { auth } from '@clerk/nextjs/server';
import { AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

import { dashboardApiClient } from '@/app-api-clients/dashboard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { IEPOverview } from '@/features/dashboard/IEPOverview';
import { MilestoneOverview } from '@/features/dashboard/MilestoneOverview';
import { StudentOverview } from '@/features/dashboard/StudentOverview';

async function getDashboardMetrics(_organizationId: string) {
  try {
    return await dashboardApiClient.getDashboardMetrics();
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
}

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

export default async function DashboardPage() {
  const { orgId } = auth();

  if (!orgId) {
    redirect('/select-org');
  }

  let metrics;
  let error;

  try {
    metrics = await getDashboardMetrics(orgId);
  } catch (e) {
    error = e as Error;
  }

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
        : !metrics
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
                    <StudentOverview metrics={metrics.students} />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Milestone Tracking</h3>
                      <p className="text-sm text-muted-foreground">
                        Progress on student milestones and achievements
                      </p>
                    </div>
                    <MilestoneOverview metrics={metrics.milestones} />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">IEP Management</h3>
                      <p className="text-sm text-muted-foreground">
                        Individual Education Plan progress and reviews
                      </p>
                    </div>
                    <IEPOverview metrics={metrics.ieps} />
                  </div>
                </div>
              )}
    </div>
  );
}
