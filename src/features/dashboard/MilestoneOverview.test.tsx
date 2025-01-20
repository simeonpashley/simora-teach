import { render, screen } from '@testing-library/react';

import { MilestoneOverview } from './MilestoneOverview';

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="link">
      {children}
    </a>
  ),
}));

describe('MilestoneOverview', () => {
  const mockMetrics = {
    pending: 5,
    completed: 10,
    overdue: 2,
  };

  it('renders null when no metrics provided', () => {
    const { container } = render(<MilestoneOverview />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders metrics cards with correct values and filtered links', () => {
    render(<MilestoneOverview metrics={mockMetrics} />);

    // Check values
    expect(screen.getByText('Milestone Tracking')).toBeInTheDocument();
    expect(screen.getByText('17')).toBeInTheDocument(); // Total milestones
    expect(screen.getByText('Total milestones tracked')).toBeInTheDocument();

    expect(screen.getByText('Pending Milestones')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Yet to be marked as Developing or Secure')).toBeInTheDocument();

    expect(screen.getByText('Completed Milestones')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('59% completion rate')).toBeInTheDocument();

    expect(screen.getByText('Overdue Milestones')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Past expected completion date')).toBeInTheDocument();

    // Check filtered links
    const links = screen.getAllByTestId('link');

    expect(links[0]).toHaveAttribute('href', '/dashboard/milestones'); // Unfiltered link
    expect(links[1]).toHaveAttribute('href', '/dashboard/milestones?status=Emerging');
    expect(links[2]).toHaveAttribute('href', '/dashboard/milestones?status=Secure');
    expect(links[3]).toHaveAttribute('href', '/dashboard/milestones?status=Emerging&overdue=true');
  });

  it('calculates completion rate correctly', () => {
    render(<MilestoneOverview metrics={mockMetrics} />);

    // Total is 17 (5 + 10 + 2), completed is 10, so rate should be 59%
    expect(screen.getByText('59% completion rate')).toBeInTheDocument();
  });
});
