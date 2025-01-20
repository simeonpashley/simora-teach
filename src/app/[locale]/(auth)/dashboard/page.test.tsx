import { useAuth } from '@clerk/nextjs';
import { render, screen, waitFor } from '@testing-library/react';

import { dashboardApiClient } from '@/app-api-clients/dashboard';

import DashboardPage from './page';

// Mock the clerk auth hook
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(),
}));

// Mock the dashboard API client
jest.mock('@/app-api-clients/dashboard', () => ({
  dashboardApiClient: {
    getDashboardMetrics: jest.fn(),
  },
}));

// Mock the next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the overview components
jest.mock('@/features/dashboard/StudentOverview', () => ({
  StudentOverview: () => <div data-testid="student-overview">Student Overview</div>,
}));

jest.mock('@/features/dashboard/MilestoneOverview', () => ({
  MilestoneOverview: () => <div data-testid="milestone-overview">Milestone Overview</div>,
}));

jest.mock('@/features/dashboard/IEPOverview', () => ({
  IEPOverview: () => <div data-testid="iep-overview">IEP Overview</div>,
}));

jest.mock('@/features/dashboard/WeeklyPlanningOverview', () => ({
  WeeklyPlanningOverview: () => <div data-testid="weekly-planning-overview">Weekly Planning Overview</div>,
}));

jest.mock('@/features/dashboard/CommunicationOverview', () => ({
  CommunicationOverview: () => <div data-testid="communication-overview">Communication Overview</div>,
}));

describe('DashboardPage', () => {
  const mockMetrics = {
    data: {
      students: {},
      milestones: {},
      ieps: {},
      weeklyPlanning: {},
      communications: {},
    },
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should show loading state initially', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      orgId: 'test-org',
    });

    render(<DashboardPage />);

    expect(screen.getAllByTestId('metric-card-skeleton')).toHaveLength(16); // 4 + (3 * 4) cards
  });

  it.skip('should fetch and display metrics when auth is loaded', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      orgId: 'test-org',
    });

    (dashboardApiClient.getDashboardMetrics as jest.Mock).mockResolvedValue(mockMetrics);

    render(<DashboardPage />);

    // Should show loading state initially
    expect(screen.getAllByTestId('metric-card-skeleton')).toHaveLength(16);

    // Should call getDashboardMetrics with correct orgId
    expect(dashboardApiClient.getDashboardMetrics).toHaveBeenCalledWith('test-org');

    // Wait for loading state to disappear and components to appear
    await waitFor(() => {
      expect(screen.queryByTestId('metric-card-skeleton')).not.toBeInTheDocument();
      expect(screen.getAllByTestId('metric-card-skeleton')).toHaveLength(0); // Ensure no skeletons are present
      expect(screen.getByTestId('student-overview')).toBeInTheDocument();
      expect(screen.getByTestId('milestone-overview')).toBeInTheDocument();
      expect(screen.getByTestId('iep-overview')).toBeInTheDocument();
      expect(screen.getByTestId('weekly-planning-overview')).toBeInTheDocument();
      expect(screen.getByTestId('communication-overview')).toBeInTheDocument();
    });
  });

  it('should show error alert when fetch fails', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      orgId: 'test-org',
    });

    const testError = new Error('Failed to fetch metrics');
    (dashboardApiClient.getDashboardMetrics as jest.Mock).mockRejectedValue(testError);

    render(<DashboardPage />);

    // Wait for error alert to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Failed to fetch metrics/)).toBeInTheDocument();
    });
  });

  it('should not fetch metrics when auth is not loaded', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: false,
      orgId: null,
    });

    render(<DashboardPage />);

    expect(dashboardApiClient.getDashboardMetrics).not.toHaveBeenCalled();
  });
});
