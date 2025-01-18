import { render, screen } from '@testing-library/react';

import { Alert } from './alert';

describe('Alert', () => {
  it('renders children correctly', () => {
    render(<Alert>Test message</Alert>);

    expect(screen.getByRole('alert')).toHaveTextContent('Test message');
  });

  it('applies destructive variant styles', () => {
    render(<Alert variant="destructive">Error message</Alert>);
    const alert = screen.getByRole('alert');

    expect(alert).toHaveClass('border-destructive/50', 'text-destructive', 'bg-destructive/10');
  });
});
