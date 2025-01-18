import { render, screen } from '@testing-library/react';

describe('Testing Setup', () => {
  it('should have React Testing Library working', () => {
    render(<div data-testid="test">Test Setup</div>);

    expect(screen.getByTestId('test')).toBeInTheDocument();
    expect(screen.getByText('Test Setup')).toBeInTheDocument();
  });

  it('should handle console errors correctly', () => {
    expect(() => {
      console.error('This should not fail the test');
    }).not.toThrow();
  });

  it('should have environment variables set', () => {
    expect(process.env.BILLING_PLAN_ENV).toBe('test');
  });
});
