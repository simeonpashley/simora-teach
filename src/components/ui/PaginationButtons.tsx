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
 * @param pageIndex - one based current page
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
        onClick={() => onPageSet(1)} // set to first page (1-based)
        disabled={pageIndex === 1} // disable if on first page
        testId="first-page"
      >
        {'<<'}
      </PaginationButton>
      <PaginationButton
        onClick={() => onPageSet(pageIndex - 1)} // decrement page index (1-based)
        disabled={pageIndex === 1} // disable if on first page
        testId="previous-page"
      >
        {'<'}
      </PaginationButton>
      <span className="text-sm">
        Page
        {' '}
        {pageIndex /* display current page (1-based) */}
        {' '}
        of
        {' '}
        {pageCount}
      </span>
      <PaginationButton
        onClick={() => onPageSet(pageIndex + 1)} // increment page index (1-based)
        disabled={pageIndex === pageCount} // disable if on last page
        testId="next-page"
      >
        {'>'}
      </PaginationButton>
      <PaginationButton
        onClick={() => onPageSet(pageCount)} // set to last page (1-based)
        disabled={pageIndex === pageCount} // disable if on last page
        testId="last-page"
      >
        {'>>'}
      </PaginationButton>
    </div>
  );
}
