import type { ColumnDef } from '@tanstack/react-table';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Radix UI Select
jest.mock('@/components/ui/select', () => {
  let currentOnValueChange: ((value: string) => void) | undefined;

  const SelectButton = ({ value }: any) => (
    <button
      type="button"
      role="combobox"
      data-testid="rows-per-page-select-trigger"
      aria-label="Rows per page"
      aria-expanded="false"
      aria-controls="listbox"
      className="flex h-8 w-[70px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
    >
      <span style={{ pointerEvents: 'none' }}>{value}</span>
      <svg
        className="lucide lucide-chevron-down size-4 opacity-50"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );

  return {
    Select: ({ children, value, onValueChange }: any) => {
      currentOnValueChange = onValueChange;
      return (
        <div>
          <SelectButton value={value} />
          <div role="listbox" id="listbox">
            {children}
          </div>
        </div>
      );
    },
    SelectTrigger: ({ children }: any) => <SelectButton value={children} />,
    SelectValue: () => null,
    SelectContent: ({ children }: any) => <div>{children}</div>,
    SelectItem: ({ children, value }: any) => (
      <button
        role="option"
        aria-selected="false"
        data-testid={`select-option-${value}`}
        onClick={() => currentOnValueChange?.(value)}
        onKeyDown={e => e.key === 'Enter' && currentOnValueChange?.(value)}
        tabIndex={0}
      >
        {children}
      </button>
    ),
  };
});

// Test data types
export type TestData = {
  id: string;
  name: string;
  age: number;
};

// Test data
export const testData: TestData[] = [
  { id: 'uuid-1', name: 'Alice', age: 25 },
  { id: 'uuid-2', name: 'Bob', age: 30 },
  { id: 'uuid-3', name: 'Charlie', age: 35 },
  { id: 'uuid-4', name: 'David', age: 40 },
  { id: 'uuid-5', name: 'Eve', age: 45 },
];

// Test columns
export const columns: ColumnDef<TestData, any>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID',
    cell: info => info.getValue(),
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    cell: info => info.getValue(),
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: 'Age',
    cell: info => info.getValue(),
  },
];
