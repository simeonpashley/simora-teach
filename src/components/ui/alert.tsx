import { cn } from '@/lib/utils';

type AlertProps = {
  variant?: 'default' | 'destructive';
} & React.HTMLAttributes<HTMLDivElement>;

export function Alert({
  children,
  className,
  variant = 'default',
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border p-4',
        variant === 'destructive' && 'border-destructive/50 text-destructive bg-destructive/10',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
