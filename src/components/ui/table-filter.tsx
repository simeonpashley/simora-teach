'use client';

import type { Column } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

type FilterProps<TData> = {
  column: Column<TData, unknown>;
};

export function TableFilter<TData>({ column }: FilterProps<TData>) {
  const columnFilterValue = column.getFilterValue();
  const uniqueValues = Array.from(column.getFacetedUniqueValues().keys()).sort();
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    setValue(columnFilterValue as string ?? 'all');
  }, [columnFilterValue]);

  const updateFilter = (newValue: string) => {
    setValue(newValue);
    column.setFilterValue(newValue === 'all' ? undefined : newValue);
  };

  const meta = column.columnDef.meta as { filterVariant?: 'text' | 'select' } | undefined;
  const filterVariant = meta?.filterVariant ?? 'text';

  if (filterVariant === 'select' && uniqueValues.length > 0) {
    return (
      <Select
        value={value || 'all'}
        onValueChange={updateFilter}
      >
        <SelectTrigger className="h-8 w-[150px]">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {uniqueValues.map(value => (
            <SelectItem key={String(value)} value={String(value)}>
              {String(value)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Input
      type="text"
      value={value === 'all' ? '' : value}
      onChange={e => updateFilter(e.target.value)}
      placeholder={`Filter ${column.id}...`}
      className="h-8 w-[150px]"
    />
  );
}
