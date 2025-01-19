import { Users } from 'lucide-react';

import { MetricCard } from '@/components/ui/metric-card';

type StudentOverviewProps = {
  metrics: {
    total: number;
    senStudents: number;
    eyfsStudents: number;
    activeStudents: number;
    inactiveStudents: number;
  };
};

export function StudentOverview({ metrics }: StudentOverviewProps) {
  const activePercentage = Math.round(
    (metrics.activeStudents / metrics.total) * 100,
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Students"
        value={metrics.total}
        icon={<Users className="size-4" />}
      />
      <MetricCard
        title="SEN Students"
        value={metrics.senStudents}
        description={`${Math.round(
          (metrics.senStudents / metrics.total) * 100,
        )}% of total students`}
      />
      <MetricCard
        title="EYFS Students"
        value={metrics.eyfsStudents}
        description={`${Math.round(
          (metrics.eyfsStudents / metrics.total) * 100,
        )}% of total students`}
      />
      <MetricCard
        title="Student Status"
        value={metrics.activeStudents}
        description="Active Students"
        trend={{
          value: activePercentage,
          label: 'of total students',
          isPositive: activePercentage >= 50,
        }}
      />
    </div>
  );
}
