import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DataTable } from '../';
import { columns, testData } from './test-utils';

describe('DataTable Selection', () => {
  const defaultProps = {
    data: testData,
    columns,
  };

  const selectionProps = {
    selectedRows: new Set<string>(),
    onSelectedRowsChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders row checkboxes when selection is enabled', () => {
    render(
      <DataTable
        {...defaultProps}
        selection={selectionProps}
      />,
    );

    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes).toHaveLength(testData.length + 1); // One checkbox per row plus header checkbox
  });

  it('renders select all checkbox in header', () => {
    render(
      <DataTable
        {...defaultProps}
        selection={selectionProps}
      />,
    );

    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });

    expect(selectAllCheckbox).toBeInTheDocument();
    expect(selectAllCheckbox).not.toBeChecked();
  });

  it('selects individual rows', async () => {
    let selectedRows = new Set<string>();
    const onSelectedRowsChange = jest.fn().mockImplementation((newSelection: Set<string>) => {
      selectedRows = newSelection;
    });

    render(
      <DataTable
        {...defaultProps}
        selection={{
          selectedRows,
          onSelectedRowsChange,
        }}
      />,
    );

    const firstRowCheckbox = screen.getAllByRole('checkbox')[1]; // First row after header

    expect(firstRowCheckbox).toBeInTheDocument();

    if (!(firstRowCheckbox instanceof HTMLElement)) {
      throw new TypeError('First row checkbox not found or is not an HTMLElement');
    }

    await userEvent.click(firstRowCheckbox);

    expect(onSelectedRowsChange).toHaveBeenCalled();
    expect(selectedRows).toEqual(new Set(['uuid-1'])); // First row ID is 1
  });

  it('selects all rows when header checkbox is clicked', async () => {
    let selectedRows = new Set<string>();
    const onSelectedRowsChange = jest.fn().mockImplementation((newSelection: Set<string>) => {
      selectedRows = newSelection;
    });

    render(
      <DataTable
        {...defaultProps}
        selection={{
          selectedRows,
          onSelectedRowsChange,
        }}
      />,
    );

    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    await userEvent.click(selectAllCheckbox);

    expect(onSelectedRowsChange).toHaveBeenCalled();
    expect(selectedRows).toEqual(new Set<string>(['uuid-1', 'uuid-2', 'uuid-3', 'uuid-4', 'uuid-5'])); // All row IDs
  });

  it('deselects all rows when header checkbox is clicked again', async () => {
    let selectedRows = new Set<string>(['uuid-1', 'uuid-2', 'uuid-3', 'uuid-4', 'uuid-5']); // All row IDs
    const onSelectedRowsChange = jest.fn().mockImplementation((newSelection: Set<string>) => {
      selectedRows = newSelection;
    });

    render(
      <DataTable
        {...defaultProps}
        selection={{
          selectedRows,
          onSelectedRowsChange,
        }}
      />,
    );

    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    await userEvent.click(selectAllCheckbox);

    expect(onSelectedRowsChange).toHaveBeenCalled();
    expect(selectedRows).toEqual(new Set());
  });

  it('shows selection actions row when rows are selected', async () => {
    expect(testData).toBeDefined();
    expect(testData.length).toBeGreaterThan(0);

    if (!testData[0]?.id) {
      throw new Error('First row ID is undefined');
    }

    const selectedRows = new Set([testData[0].id]);

    render(
      <DataTable
        {...defaultProps}
        selection={{
          selectedRows,
          onSelectedRowsChange: jest.fn(),
        }}
        selectionActions={[
          { label: 'Delete', onClick: jest.fn() },
          { label: 'Export', onClick: jest.fn() },
        ]}
      />,
    );

    const actionsRow = screen.getByTestId('selection-actions');

    expect(actionsRow).toBeInTheDocument();
    expect(screen.getByText('1 row selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
  });

  it('hides selection actions row when no rows are selected', () => {
    render(
      <DataTable
        {...defaultProps}
        selection={{
          selectedRows: new Set(),
          onSelectedRowsChange: jest.fn(),
        }}
        selectionActions={[
          { label: 'Delete', onClick: jest.fn() },
          { label: 'Export', onClick: jest.fn() },
        ]}
      />,
    );

    expect(screen.queryByTestId('selection-actions')).not.toBeInTheDocument();
  });

  it('triggers action when selection action button is clicked', async () => {
    const deleteAction = jest.fn();

    expect(testData).toBeDefined();
    expect(testData.length).toBeGreaterThan(0);

    if (!testData[0]?.id) {
      throw new Error('First row ID is undefined');
    }

    const selectedRows = new Set([testData[0].id]);

    render(
      <DataTable
        {...defaultProps}
        selection={{
          selectedRows,
          onSelectedRowsChange: jest.fn(),
        }}
        selectionActions={[
          { label: 'Delete', onClick: deleteAction },
        ]}
      />,
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    expect(deleteAction).toHaveBeenCalledWith(Array.from(selectedRows));
  });

  it('maintains selection state across sorting and filtering', async () => {
    expect(testData).toBeDefined();
    expect(testData.length).toBeGreaterThan(0);

    if (!testData[0]?.id) {
      throw new Error('First row ID is undefined');
    }
    const testDataId = testData[0]?.id;

    const selectedRows = new Set([testDataId]);
    const onSelectedRowsChange = jest.fn();

    render(
      <DataTable
        {...defaultProps}
        selection={{
          selectedRows,
          onSelectedRowsChange,
        }}
        sorting={{
          sortBy: 'name',
          sortOrder: 'asc',
          onSort: jest.fn(),
        }}
      />,
    );

    const nameHeader = screen.getByRole('columnheader', { name: /name/i });
    await userEvent.click(nameHeader);

    const selectedCheckbox = screen.getAllByRole('checkbox')
      .find(checkbox => checkbox.getAttribute('data-row-id') === String(testDataId));

    expect(selectedCheckbox).toBeChecked();
  });
});
