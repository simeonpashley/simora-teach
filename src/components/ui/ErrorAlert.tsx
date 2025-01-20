import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ErrorAlertProps = {
  error: Error;
};

export function ErrorAlert({ error }: ErrorAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" data-testid="alert-circle" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load dashboard metrics:
        {' '}
        {error.message}
      </AlertDescription>
    </Alert>
  );
}
