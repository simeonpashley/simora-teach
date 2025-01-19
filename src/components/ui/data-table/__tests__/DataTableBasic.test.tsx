import { render, screen } from '@testing-library/react';

import { DataTable } from '../';
import type { TestData } from './test-utils';
import { columns, testData } from './test-utils';

describe('DataTable Basic Functionality', () => {
  const defaultProps = {
    data: testData,
    columns,
  };

  describe('Basic Rendering', () => {
    it('renders table with data', () => {
      render(<DataTable {...defaultProps} />);

      // Check headers
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();

      // Check data
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('displays no results message when data is empty', () => {
      render(<DataTable {...defaultProps} data={[]} noResults="No data available" />);

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  it('renders basic table with data', () => {
    render(<DataTable<TestData, any> data={testData} columns={columns} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('shows no results message when data is empty', () => {
    const noResults = 'Custom no results message';
    render(<DataTable<TestData, any> data={[]} columns={columns} noResults={noResults} />);

    expect(screen.getByText(noResults)).toBeInTheDocument();
  });
});
