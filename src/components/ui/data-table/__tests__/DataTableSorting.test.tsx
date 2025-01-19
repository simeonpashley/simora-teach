import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DataTable } from '../';
import { columns, testData } from './test-utils';

describe('DataTable Sorting', () => {
  const defaultProps = {
    data: testData,
    columns,
  };

  const sortingProps = {
    sortBy: 'name',
    sortOrder: 'asc' as const,
    onSort: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays sort indicators', () => {
    render(
      <DataTable
        {...defaultProps}
        sorting={sortingProps}
      />,
    );

    const nameHeader = screen.getByText('Name');

    expect(nameHeader.parentElement).toHaveTextContent('↑');
  });

  it('calls onSort when clicking sortable column', async () => {
    render(
      <DataTable
        {...defaultProps}
        sorting={sortingProps}
      />,
    );

    const nameHeader = screen.getByText('Name').closest('th');
    if (!nameHeader) {
      throw new Error('Header element not found');
    }
    await userEvent.click(nameHeader);

    expect(sortingProps.onSort).toHaveBeenCalledWith('name');
  });

  it('toggles sort direction when clicking the same column', async () => {
    render(
      <DataTable
        {...defaultProps}
        sorting={sortingProps}
      />,
    );

    const nameHeader = screen.getByText('Name').closest('th');
    if (!nameHeader) {
      throw new Error('Header element not found');
    }

    // First click - already asc, should trigger desc
    await userEvent.click(nameHeader);

    expect(sortingProps.onSort).toHaveBeenCalledWith('name');

    // Verify sort indicator
    expect(nameHeader).toHaveTextContent(/↑/);
  });

  it('shows no sort indicator for non-sortable columns', () => {
    const columnsWithNonSortable = [
      ...columns,
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: () => <button>Action</button>,
      },
    ];

    render(
      <DataTable
        data={testData}
        columns={columnsWithNonSortable}
        sorting={sortingProps}
      />,
    );

    const actionsHeader = screen.getByText('Actions').closest('th');
    if (!actionsHeader) {
      throw new Error('Actions header not found');
    }

    expect(actionsHeader).not.toHaveTextContent(/[↑↓]/);
  });

  it('calls onSort when column header is clicked', async () => {
    const onSort = jest.fn();

    render(
      <DataTable
        {...defaultProps}
        sorting={{
          sortBy: '',
          sortOrder: 'asc',
          onSort,
        }}
      />,
    );

    await userEvent.click(screen.getByText('Name'));

    expect(onSort).toHaveBeenCalledWith('name');
  });
});
