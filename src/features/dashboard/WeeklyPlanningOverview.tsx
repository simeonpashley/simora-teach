import { Calendar, CheckCircle2, XCircle } from 'lucide-react';

import { MetricCard } from '@/components/ui/metric-card';

type WeeklyPlanningOverviewProps = {
  metrics: {
    activitiesThisWeek: number;
    termlyProgress: number;
    missedActivities: number;
  };
};

export function WeeklyPlanningOverview({ metrics }: WeeklyPlanningOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Activities This Week"
        value={metrics.activitiesThisWeek}
        icon={<Calendar className="size-4" />}
        description="Planned activities for current week"
      />
      <MetricCard
        title="Termly Progress"
        value={metrics.termlyProgress}
        icon={<CheckCircle2 className="size-4" />}
        description="Objectives marked as On Track"
        trend={{
          value: metrics.termlyProgress,
          label: 'completion rate',
          isPositive: metrics.termlyProgress >= 70,
        }}
      />
      <MetricCard
        title="Missed Activities"
        value={metrics.missedActivities}
        icon={<XCircle className="size-4" />}
        description="Activities not completed on time"
        trend={{
          value: metrics.missedActivities,
          label: 'need attention',
          isPositive: false,
        }}
      />
    </div>
  );
}
