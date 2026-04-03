import {
  QueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  ContractResponse,
  ContractsResponse,
  CreateContractInput,
  GetContractInput,
  UpdateContractInput,
} from '../lib/api/validation/contracts';
import { urls } from '@/utils/urls';

type ContractMutationOptions = Omit<
  UseMutationOptions<ContractResponse, Error, void>,
  'mutationFn'
>;

type ContractDeleteMutationOptions = Omit<
  UseMutationOptions<void, Error, void>,
  'mutationFn'
>;

const jsonHeaders = { 'Content-Type': 'application/json' } as const;

export const useCreateContract = (
  input: CreateContractInput,
  options: ContractMutationOptions = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(urls.api.contracts.list(), {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Failed to create contract');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
  });
};

export const useContracts = (
  filters: Partial<GetContractInput>,
  options: QueryOptions<ContractsResponse> = {},
) => {
  return useQuery({
    queryKey: ['contracts', filters],
    queryFn: async () => {
      const res = await fetch(urls.api.contracts.list(filters), {
        method: 'GET',
        headers: jsonHeaders,
      });
      if (!res.ok) throw new Error('Failed to fetch contracts');
      const json = (await res.json()) as {
        success: boolean;
        data: ContractsResponse;
      };
      if (!json.success) throw new Error('Failed to fetch contracts');
      return json.data;
    },

    ...options,
  });
};

export const useContract = (
  id: number,
  options: QueryOptions<ContractResponse> = {},
) => {
  return useQuery({
    queryKey: ['contract', id],
    queryFn: async () => {
      const res = await fetch(urls.api.contracts.detail(id));
      if (!res.ok) throw new Error('Failed to fetch contract');
      return res.json();
    },
    ...options,
  });
};

export const useUpdateContract = (
  id: number,
  input: UpdateContractInput,
  options: ContractMutationOptions = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(urls.api.contracts.detail(id), {
        method: 'PATCH',
        headers: jsonHeaders,
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Failed to update contract');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contract', id] });
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
  });
};

export const useDeleteContract = (
  id: number,
  options: ContractDeleteMutationOptions = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(urls.api.contracts.detail(id), {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete contract');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.removeQueries({ queryKey: ['contract', id] });
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
  });
};
