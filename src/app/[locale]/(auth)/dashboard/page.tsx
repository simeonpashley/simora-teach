'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { DashboardMetrics } from '@/app-api-clients/dashboard';
import { dashboardApiClient } from '@/app-api-clients/dashboard';
import type { ApiResponse } from '@/app-api-clients/types';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { CommunicationOverview } from '@/features/dashboard/CommunicationOverview';
import { DashboardSkeleton } from '@/features/dashboard/DashboardSkeleton';
import { IEPOverview } from '@/features/dashboard/IEPOverview';
import { MilestoneOverview } from '@/features/dashboard/MilestoneOverview';
import { StudentOverview } from '@/features/dashboard/StudentOverview';
import { WeeklyPlanningOverview } from '@/features/dashboard/WeeklyPlanningOverview';

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

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Weekly Planning</h3>
                    <p className="text-sm text-muted-foreground">
                      Overview of weekly activities and termly progress
                    </p>
                  </div>
                  <WeeklyPlanningOverview metrics={metrics.data.weeklyPlanning} />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Communication Overview</h3>
                    <p className="text-sm text-muted-foreground">
                      Recent communications and parent engagement metrics
                    </p>
                  </div>
                  <CommunicationOverview metrics={metrics.data.communications} />
                </div>
              </div>
            )}
    </div>
  );
}
