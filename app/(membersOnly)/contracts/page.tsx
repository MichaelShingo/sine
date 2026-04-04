'use client';

import { ContractCard } from '@/components/molecules/ContractCard/ContractCard';
import { ContractsFiltersBar } from '@/components/molecules/ContractsFiltersBar/ContractsFiltersBar';
import { useContractsPage } from './useContracts';

export default function ContractsPage() {
  const { data, isLoading, error, filters, setFilters, templates } =
    useContractsPage();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Contracts</h1>
      <ContractsFiltersBar
        filters={filters}
        onChange={setFilters}
        templates={templates}
      />
      {error != null && (
        <p className="text-sm" role="alert">
          {error.message}
        </p>
      )}
      {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
      <div className="flex flex-wrap gap-4 justify-center">
        {data?.data?.map((contract) => (
          <ContractCard key={contract.id} contract={contract} />
        ))}
      </div>
    </div>
  );
}
