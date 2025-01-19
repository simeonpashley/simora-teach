import { Button } from '@/components/ui/button';

type PaginationButtonProps = {
  onClick: () => void;
  disabled: boolean;
  testId: string;
  children: React.ReactNode;
};

const PaginationButton = ({
  onClick,
  disabled,
  testId,
  children,
}: PaginationButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      {children}
    </Button>
  );
};

type PaginationButtonsProps = {
  pageIndex: number;
  pageCount: number;
  onPageSet: (pageIndex: number) => void;
};

/**
 * PaginationButtons component
 * @param pageIndex - zero based current page
 * @param pageCount - total number of pages
 * @param onPageSet - callback function to set the page index
 */
export function PaginationButtons({
  pageIndex,
  pageCount,
  onPageSet,
}: PaginationButtonsProps) {
  return (
    <div data-testid="pagination-buttons" className="flex items-center gap-2">
      <PaginationButton
        onClick={() => onPageSet(0)}
        disabled={pageIndex === 0}
        testId="first-page"
      >
        {'<<'}
      </PaginationButton>
      <PaginationButton
        onClick={() => onPageSet(pageIndex - 1)}
        disabled={pageIndex === 0}
        testId="previous-page"
      >
        {'<'}
      </PaginationButton>
      <span className="text-sm">
        Page
        {' '}
        {pageIndex}
        {' '}
        of
        {' '}
        {pageCount}
      </span>
      <PaginationButton
        onClick={() => onPageSet(pageIndex + 1)}
        disabled={pageIndex === pageCount - 1}
        testId="next-page"
      >
        {'>'}
      </PaginationButton>
      <PaginationButton
        onClick={() => onPageSet(pageCount)}
        disabled={pageIndex === pageCount - 1}
        testId="last-page"
      >
        {'>>'}
      </PaginationButton>
    </div>
  );
}
