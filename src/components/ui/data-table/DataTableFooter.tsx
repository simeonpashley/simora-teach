import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { PaginationButtons } from '../PaginationButtons';

type DataTableFooterProps = {
  pagination: {
    totalRows: number;
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    totalItems?: number;
    onPageSet: (pageIndex: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  rowCount: number;
};

export function DataTableFooter({
  pagination,
  rowCount,
}: DataTableFooterProps) {
  if (rowCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Rows per page</span>
        <Select
          data-testid="rows-per-page-select"
          value={String(pagination.pageSize)}
          onValueChange={value => pagination.onPageSizeChange(Number(value))}
        >
          <SelectTrigger data-testid="rows-per-page-select-trigger" className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 50].map(size => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <PaginationButtons
        pageIndex={pagination.pageIndex}
        pageCount={pagination.pageCount}
        onPageSet={pagination.onPageSet}
      />
    </div>
  );
}
