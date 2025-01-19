import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DataTableFooter } from './DataTableFooter';

const defaultProps = {
  pagination: {
    totalRows: 100,
    pageIndex: 0,
    pageSize: 10,
    pageCount: 10,
    onPageSet: jest.fn(),
    onPageSizeChange: jest.fn(),
  },
  rowCount: 10,
};

describe('DataTableFooter', () => {
  it.skip('renders pagination controls', () => {
    render(<DataTableFooter {...defaultProps} />);

    expect(screen.getByText('Rows per page')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByTestId('rows-per-page-select')).toBeInTheDocument();
  });

  it('does not render when rowCount is 0', () => {
    const { container } = render(
      <DataTableFooter {...defaultProps} rowCount={0} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it.skip('calls onPageSizeChange when rows per page is changed', async () => {
    const user = userEvent.setup();
    render(<DataTableFooter {...defaultProps} />);

    const select = screen.getByTestId('rows-per-page-select');
    await user.click(select);

    const option = screen.getByRole('option', { name: '20' });
    await user.click(option);

    expect(defaultProps.pagination.onPageSizeChange).toHaveBeenCalledWith(20);
  });
});
