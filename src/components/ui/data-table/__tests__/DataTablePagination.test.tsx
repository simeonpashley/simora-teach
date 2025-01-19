import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DataTable } from '../';
import { columns, testData } from './test-utils';

describe('DataTable Pagination', () => {
  const defaultProps = {
    data: testData,
    columns,
  };

  const paginationProps = {
    totalRows: 15,
    pageIndex: 0,
    pageSize: 10,
    pageCount: 2,
    onPageSet: jest.fn(),
    onPageSizeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pagination controls when pagination props are provided', () => {
    render(
      <DataTable
        {...defaultProps}
        pagination={paginationProps}
      />,
    );

    expect(screen.getByText('Rows per page')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveTextContent('10');
  });

  it('calls onPageSet when page is changed', async () => {
    render(
      <DataTable
        {...defaultProps}
        pagination={paginationProps}
      />,
    );

    const nextButton = screen.getByTestId('next-page');
    await userEvent.click(nextButton);

    expect(paginationProps.onPageSet).toHaveBeenCalledWith(1);
  });

  it.skip('calls onPageSizeChange when rows per page is changed', async () => {
    render(
      <DataTable
        {...defaultProps}
        pagination={paginationProps}
      />,
    );

    const user = userEvent.setup();
    const select = screen.getByTestId('rows-per-page-select-trigger');
    await user.click(select);

    const option20 = await screen.findByTestId('select-option-20');
    await user.click(option20);

    expect(paginationProps.onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it('disables previous/first page buttons on first page', () => {
    render(
      <DataTable
        {...defaultProps}
        pagination={{ ...paginationProps, pageIndex: 0 }}
      />,
    );

    expect(screen.getByTestId('first-page')).toBeDisabled();
    expect(screen.getByTestId('previous-page')).toBeDisabled();
    expect(screen.getByTestId('next-page')).toBeEnabled();
    expect(screen.getByTestId('last-page')).toBeEnabled();
  });

  it('disables next/last page buttons on last page', () => {
    render(
      <DataTable
        {...defaultProps}
        pagination={{ ...paginationProps, pageIndex: 1 }}
      />,
    );

    expect(screen.getByTestId('first-page')).toBeEnabled();
    expect(screen.getByTestId('previous-page')).toBeEnabled();
    expect(screen.getByTestId('next-page')).toBeDisabled();
    expect(screen.getByTestId('last-page')).toBeDisabled();
  });

  it('shows correct page information', () => {
    render(
      <DataTable
        {...defaultProps}
        pagination={{
          ...paginationProps,
          pageIndex: 1,
          pageSize: 5,
          totalRows: 12,
        }}
      />,
    );

    expect(screen.getByText('Showing 6 - 10 of 12 items')).toBeInTheDocument();
  });

  it('handles last page with partial results', () => {
    render(
      <DataTable
        {...defaultProps}
        pagination={{
          ...paginationProps,
          pageIndex: 2,
          pageSize: 5,
          totalRows: 12,
        }}
      />,
    );

    expect(screen.getByText('Showing 11 - 12 of 12 items')).toBeInTheDocument();
  });
});
