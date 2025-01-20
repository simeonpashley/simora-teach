import { render, screen } from '@testing-library/react';
import { Clock } from 'lucide-react';

import { MetricCard } from './metric-card';

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="link">
      {children}
    </a>
  ),
}));

describe('MetricCard', () => {
  const defaultProps = {
    title: 'Test Metric',
    value: '100',
  };

  it('renders basic card with title and value', () => {
    render(<MetricCard {...defaultProps} />);

    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(
      <MetricCard
        {...defaultProps}
        icon={<Clock data-testid="clock-icon" />}
      />,
    );

    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(
      <MetricCard
        {...defaultProps}
        description="Test description"
      />,
    );

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders with positive trend', () => {
    render(
      <MetricCard
        {...defaultProps}
        trend={{
          value: 10,
          label: 'increase',
          isPositive: true,
        }}
      />,
    );

    expect(screen.getByText('↑')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('increase')).toBeInTheDocument();
  });

  it('renders with negative trend', () => {
    render(
      <MetricCard
        {...defaultProps}
        trend={{
          value: 5,
          label: 'decrease',
          isPositive: false,
        }}
      />,
    );

    expect(screen.getByText('↓')).toBeInTheDocument();
    expect(screen.getByText('5%')).toBeInTheDocument();
    expect(screen.getByText('decrease')).toBeInTheDocument();
  });

  it('renders as a link when href is provided', () => {
    render(
      <MetricCard
        {...defaultProps}
        href="/test-link"
      />,
    );

    const link = screen.getByTestId('link');

    expect(link).toHaveAttribute('href', '/test-link');
    expect(link).toContainElement(screen.getByText('Test Metric'));
    expect(link).toContainElement(screen.getByText('100'));
  });

  it('renders as a regular card when no href is provided', () => {
    render(<MetricCard {...defaultProps} />);

    expect(screen.queryByTestId('link')).not.toBeInTheDocument();
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
