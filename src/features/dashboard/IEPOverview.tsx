import { Calendar, CheckCircle2, FileText } from 'lucide-react';

import { MetricCard } from '@/components/ui/metric-card';

type IEPOverviewProps = {
  metrics: {
    active: number;
    upcomingReviews: number;
    completedGoals: number;
  };
};

export function IEPOverview({ metrics }: IEPOverviewProps) {
  const total = metrics.active + metrics.completedGoals;
  const completionRate = Math.round((metrics.completedGoals / total) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Active IEPs"
        value={metrics.active}
        icon={<FileText className="size-4" />}
        description="Currently in progress"
      />
      <MetricCard
        title="Upcoming Reviews"
        value={metrics.upcomingReviews}
        icon={<Calendar className="size-4" />}
        description="Due within 30 days"
        trend={{
          value: Math.round((metrics.upcomingReviews / metrics.active) * 100),
          label: 'of active IEPs',
          isPositive: false,
        }}
      />
      <MetricCard
        title="Completed Goals"
        value={metrics.completedGoals}
        icon={<CheckCircle2 className="size-4" />}
        description={`${completionRate}% completion rate`}
        trend={{
          value: completionRate,
          label: 'completion rate',
          isPositive: completionRate >= 50,
        }}
      />
    </div>
  );
}
