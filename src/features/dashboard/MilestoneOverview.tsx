import { CheckCircle, Clock, Target } from 'lucide-react';

import { MetricCard } from '@/components/ui/metric-card';

type MilestoneOverviewProps = {
  metrics: {
    pending: number;
    completed: number;
    overdue: number;
  };
};

export function MilestoneOverview({ metrics }: MilestoneOverviewProps) {
  const total = metrics.pending + metrics.completed + metrics.overdue;
  const completionRate = Math.round((metrics.completed / total) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Pending Milestones"
        value={metrics.pending}
        icon={<Clock className="size-4" />}
        description="Yet to be marked as Developing or Secure"
      />
      <MetricCard
        title="Completed Milestones"
        value={metrics.completed}
        icon={<CheckCircle className="size-4" />}
        description={`${completionRate}% completion rate`}
        trend={{
          value: completionRate,
          label: 'completion rate',
          isPositive: completionRate >= 50,
        }}
      />
      <MetricCard
        title="Overdue Milestones"
        value={metrics.overdue}
        icon={<Target className="size-4" />}
        description="Past expected completion date"
        trend={{
          value: Math.round((metrics.overdue / total) * 100),
          label: 'of total milestones',
          isPositive: false,
        }}
      />
    </div>
  );
}
