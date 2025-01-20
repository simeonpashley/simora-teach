import { render, screen } from '@testing-library/react';

import { ErrorAlert } from './ErrorAlert';

describe('ErrorAlert', () => {
  it('should render error message', () => {
    const testError = new Error('Test error message');
    render(<ErrorAlert error={testError} />);

    // Check for error title
    expect(screen.getByText('Error')).toBeInTheDocument();

    // Check for error message
    expect(screen.getByText(/Test error message/)).toBeInTheDocument();

    // Check for alert icon
    expect(screen.getByTestId('alert-circle')).toBeInTheDocument();

    // Check for destructive variant styling
    const alert = screen.getByRole('alert');

    expect(alert).toHaveClass('border-destructive/50', 'text-destructive');
  });
});
