/* eslint-disable tailwindcss/no-custom-classname */
import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';

// Mock Radix UI's Portal to make testing easier
jest.mock('@radix-ui/react-alert-dialog', () => {
  const actual = jest.requireActual('@radix-ui/react-alert-dialog');
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe('AlertDialog', () => {
  const TestDialog = ({
    onAction,
    onCancel,
  }: {
    onAction?: () => void;
    onCancel?: () => void;
  }) => (
    <AlertDialog>
      <AlertDialogTrigger data-testid="trigger">Open Dialog</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} data-testid="cancel">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onAction} data-testid="confirm">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  it('renders trigger button correctly', () => {
    render(<TestDialog />);

    expect(screen.getByTestId('trigger')).toBeInTheDocument();
  });

  it('shows dialog content when trigger is clicked', () => {
    render(<TestDialog />);
    fireEvent.click(screen.getByTestId('trigger'));

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('calls onAction when confirm button is clicked', () => {
    const onAction = jest.fn();
    render(<TestDialog onAction={onAction} />);

    fireEvent.click(screen.getByTestId('trigger'));
    fireEvent.click(screen.getByTestId('confirm'));

    expect(onAction).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = jest.fn();
    render(<TestDialog onCancel={onCancel} />);

    fireEvent.click(screen.getByTestId('trigger'));
    fireEvent.click(screen.getByTestId('cancel'));

    expect(onCancel).toHaveBeenCalled();
  });

  it('renders with custom className', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger data-testid="trigger">Open Dialog</AlertDialogTrigger>
        <AlertDialogContent className="custom-class">
          <AlertDialogHeader>
            <AlertDialogTitle>Test Title</AlertDialogTitle>
            <AlertDialogDescription>
              Test Description
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>,
    );

    fireEvent.click(screen.getByTestId('trigger'));

    expect(screen.getByRole('alertdialog')).toHaveClass('custom-class');
  });

  it('maintains proper accessibility attributes', () => {
    render(<TestDialog />);
    fireEvent.click(screen.getByTestId('trigger'));

    const dialog = screen.getByRole('alertdialog');

    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent('Are you sure?');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
  });
});
