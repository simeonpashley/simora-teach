'use client';

import { Button } from '@/components/ui/button';

type SortButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  direction?: 'asc' | 'desc';
};

export function SortButton({ onClick, children, direction }: SortButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="hover:bg-transparent"
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="ml-2 size-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {direction === 'desc'
          ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v12m0 0l4-4m-4 4l-4-4m10-8v12m0 0l4-4m-4 4l-4-4"
              />
            )
          : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            )}
      </svg>
    </Button>
  );
}
