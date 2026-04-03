'use client';

import type { ContractsFiltersState } from '@/components/molecules/ContractsFiltersBar/ContractsFiltersBar';
import { useContracts } from '@/app/queries/contracts';
import { useTemplates } from '@/app/queries/templates';
import type { GetContractInput } from '@/app/lib/api/validation/contracts';
import {
  deadlineExclusiveUpperBound,
  deadlineLowerBoundAfterDay,
} from '@/utils/date';
import { useEffect, useMemo, useState } from 'react';

const defaultFilters = (): ContractsFiltersState => ({
  searchTerm: '',
  sortBy: 'createdAt',
  sortDir: 'desc',
  sentFilter: 'any',
  deadlineMode: 'none',
  deadlineDate: '',
  templateId: '',
});

const buildQueryParams = (
  ui: ContractsFiltersState,
  debouncedSearch: string,
): Partial<GetContractInput> => {
  const out: Partial<GetContractInput> = {
    page: 1,
    limit: 50,
    sortBy: ui.sortBy,
    sortDir: ui.sortDir,
  };

  const q = debouncedSearch.trim();
  if (q) out.searchTerm = q;

  if (ui.sentFilter === 'sent') out.isSent = true;
  else if (ui.sentFilter === 'notSent') out.isSent = false;

  if (ui.templateId !== '') out.templateId = ui.templateId;

  if (ui.deadlineMode !== 'none' && ui.deadlineDate) {
    if (ui.deadlineMode === 'before') {
      out.deadlineIsBefore = deadlineExclusiveUpperBound(ui.deadlineDate);
    } else {
      out.deadlineIsAfter = deadlineLowerBoundAfterDay(ui.deadlineDate);
    }
  }

  return out;
};

export const useContractsPage = () => {
  const [filters, setFiltersState] =
    useState<ContractsFiltersState>(defaultFilters);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.searchTerm), 300);
    return () => clearTimeout(t);
  }, [filters.searchTerm]);

  const queryParams = useMemo(
    () => buildQueryParams(filters, debouncedSearch),
    [filters, debouncedSearch],
  );

  const { data, isLoading, error } = useContracts(queryParams);

  const { data: templates } = useTemplates({});

  const setFilters = (patch: Partial<ContractsFiltersState>) => {
    setFiltersState((f) => ({ ...f, ...patch }));
  };

  return {
    data,
    isLoading,
    error,
    filters,
    setFilters,
    templates: templates ?? [],
  };
};
