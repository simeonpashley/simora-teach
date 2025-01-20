import { ClipboardList, MessageCircle, Users2 } from 'lucide-react';

import { MetricCard } from '@/components/ui/metric-card';

type CommunicationOverviewProps = {
  metrics?: {
    recentCount: number;
    followUpsDue: number;
    parentEngagement: number;
  };
};

export function CommunicationOverview({ metrics }: CommunicationOverviewProps) {
  if (!metrics) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Recent Communications"
        value={metrics.recentCount}
        icon={<MessageCircle className="size-4" />}
        description="Communications in last 7 days"
      />
      <MetricCard
        title="Follow-ups Due"
        value={metrics.followUpsDue}
        icon={<ClipboardList className="size-4" />}
        description="Follow-ups scheduled this week"
        trend={{
          value: metrics.followUpsDue,
          label: 'need attention',
          isPositive: false,
        }}
      />
      <MetricCard
        title="Parent Engagement"
        value={metrics.parentEngagement}
        icon={<Users2 className="size-4" />}
        description="Parents engaged in last 30 days"
        trend={{
          value: metrics.parentEngagement,
          label: 'engagement rate',
          isPositive: metrics.parentEngagement >= 70,
        }}
      />
    </div>
  );
}
