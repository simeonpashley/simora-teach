import { render, screen } from '@testing-library/react';

import { DashboardSkeleton } from './DashboardSkeleton';

describe('DashboardSkeleton', () => {
  it('should render all skeleton sections', () => {
    render(<DashboardSkeleton />);

    // Check for all metric card skeletons
    const skeletonCards = screen.getAllByTestId('metric-card-skeleton');

    // 4 cards for student overview + 3 cards each for other sections (4 sections)
    const expectedCardCount = 4 + (3 * 4);

    expect(skeletonCards).toHaveLength(expectedCardCount);
  });

  it('should render with correct grid layouts', () => {
    render(<DashboardSkeleton />);

    // Get all grid containers
    const gridContainers = screen.getAllByTestId('skeleton-grid');

    // First grid (Student Overview) should have 4 columns in lg
    expect(gridContainers[0]).toHaveClass('lg:grid-cols-4');

    // Other grids should have 3 columns in lg
    gridContainers.slice(1).forEach((container) => {
      expect(container).toHaveClass('lg:grid-cols-3');
    });
  });
});
