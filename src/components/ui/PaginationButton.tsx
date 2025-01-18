'use client';

import { Button } from '@/components/ui/button';

type PaginationButtonProps = {
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
  icon: 'first' | 'previous' | 'next' | 'last';
  className?: string;
};

const icons = {
  first: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
    />
  ),
  previous: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  ),
  next: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  ),
  last: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 5l7 7-7 7M5 5l7 7-7 7"
    />
  ),
};

export function PaginationButton({
  onClick,
  disabled,
  ariaLabel,
  icon,
  className = 'h-8 w-8 p-0',
}: PaginationButtonProps) {
  return (
    <Button
      variant="outline"
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="sr-only">{ariaLabel}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {icons[icon]}
      </svg>
    </Button>
  );
}
