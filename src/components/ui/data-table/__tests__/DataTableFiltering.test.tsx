import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DataTable } from '../';
import { columns, testData } from './test-utils';

describe('DataTable Filtering', () => {
  const defaultProps = {
    data: testData,
    columns,
  };

  const filteringProps = {
    columnFilters: [],
    onColumnFiltersChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders filter inputs when filtering is enabled', () => {
    render(
      <DataTable
        {...defaultProps}
        filtering={filteringProps}
      />,
    );

    const filterInputs = screen.getAllByRole('textbox');

    expect(filterInputs.length).toBeGreaterThan(0);
  });

  it('calls onColumnFiltersChange when filter value changes', async () => {
    let filters: any[] = [];
    const onColumnFiltersChange = jest.fn((update) => {
      filters = typeof update === 'function' ? update(filters) : update;
      return filters;
    });

    render(
      <DataTable
        {...defaultProps}
        filtering={{
          columnFilters: filters,
          onColumnFiltersChange,
        }}
      />,
    );

    const filterInputs = screen.getAllByRole('textbox');
    await userEvent.type(filterInputs[0]!, 'ali');

    const calls = onColumnFiltersChange.mock.calls;

    expect(calls.length).toBeGreaterThan(0);

    if (calls.length === 0) {
      throw new Error('No calls made to onColumnFiltersChange');
    }

    const lastCall = calls[calls.length - 1];
    if (!lastCall) {
      throw new Error('Last call not found');
    }
    const lastUpdate = typeof lastCall[0] === 'function' ? lastCall[0]([]) : lastCall[0];

    expect(lastUpdate).toEqual([{ id: 'id', value: 'ali' }]);
  });

  it('applies multiple filters simultaneously', async () => {
    const onColumnFiltersChange = jest.fn();
    let currentFilters = [{ id: 'id', value: 'ali' }];

    onColumnFiltersChange.mockImplementation((updater: any) => {
      if (typeof updater === 'function') {
        currentFilters = updater(currentFilters);
      } else {
        currentFilters = updater;
      }
      return currentFilters;
    });

    render(
      <DataTable
        {...defaultProps}
        filtering={{
          columnFilters: currentFilters,
          onColumnFiltersChange,
        }}
      />,
    );

    const filterInputs = screen.getAllByRole('textbox');
    await userEvent.type(filterInputs[1]!, '25');

    expect(currentFilters).toEqual([
      { id: 'id', value: 'ali' },
      { id: 'name', value: '25' },
    ]);
  });

  it('clears filters when input is emptied', async () => {
    const onColumnFiltersChange = jest.fn();
    let currentFilters = [{ id: 'id', value: 'test' }];

    onColumnFiltersChange.mockImplementation((updater: any) => {
      if (typeof updater === 'function') {
        currentFilters = updater(currentFilters);
      } else {
        currentFilters = updater;
      }
      return currentFilters;
    });

    render(
      <DataTable
        {...defaultProps}
        filtering={{
          columnFilters: currentFilters,
          onColumnFiltersChange,
        }}
      />,
    );

    const filterInputs = screen.getAllByRole('textbox');
    const firstInput = filterInputs[0];
    if (!firstInput) {
      throw new Error('Filter input not found');
    }

    await userEvent.clear(firstInput);

    expect(currentFilters).toEqual([]);
  });

  it('handles filter removal correctly', async () => {
    const onColumnFiltersChange = jest.fn();
    let currentFilters = [
      { id: 'id', value: 'test' },
      { id: 'age', value: '25' },
    ];

    onColumnFiltersChange.mockImplementation((updater: any) => {
      if (typeof updater === 'function') {
        currentFilters = updater(currentFilters);
      } else {
        currentFilters = updater;
      }
      return currentFilters;
    });

    render(
      <DataTable
        {...defaultProps}
        filtering={{
          columnFilters: currentFilters,
          onColumnFiltersChange,
        }}
      />,
    );

    const filterInputs = screen.getAllByRole('textbox');
    const firstInput = filterInputs[0];
    if (!firstInput) {
      throw new Error('Filter input not found');
    }

    await userEvent.clear(firstInput);

    expect(currentFilters).toEqual([
      { id: 'age', value: '25' },
    ]);
  });

  it('shows no results message when filters match no data', () => {
    const noMatchData = testData.filter(item => item.name !== 'NoMatch');

    render(
      <DataTable
        {...defaultProps}
        data={noMatchData}
        filtering={{
          columnFilters: [{ id: 'name', value: 'NoMatch' }],
          onColumnFiltersChange: filteringProps.onColumnFiltersChange,
        }}
        noResults="No matching results"
      />,
    );

    expect(screen.getByText('No matching results')).toBeInTheDocument();
  });

  it('handles rapid filter changes', async () => {
    const onColumnFiltersChange = jest.fn();

    render(
      <DataTable
        {...defaultProps}
        filtering={{
          columnFilters: [],
          onColumnFiltersChange,
        }}
      />,
    );

    const filterInputs = screen.getAllByRole('textbox');
    const filterInput = filterInputs[0];
    if (!filterInput) {
      throw new Error('Filter input not found');
    }

    await userEvent.type(filterInput, 'test', { delay: 1 });

    expect(onColumnFiltersChange).toHaveBeenCalledTimes(4);
  });
});
