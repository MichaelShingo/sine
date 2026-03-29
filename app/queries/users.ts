import {
  type UseMutationOptions,
  QueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  CreateUserInput,
  GetUsersInput,
  PatchUserInput,
  UserResponse,
  UsersResponse,
} from '../lib/api/validation/users';
import { urls } from '@/utils/urls';

type UserMutationOptions = Omit<
  UseMutationOptions<UserResponse, Error, void>,
  'mutationFn'
>;

export const useCreateUser = (
  input: CreateUserInput,
  options: UserMutationOptions = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(urls.api.users.list(), {
        method: 'POST',
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Failed to create user');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
  });
};

export const useUsers = (
  filters: GetUsersInput,
  options: QueryOptions<UsersResponse>,
) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: filters.page?.toString() || '1',
        limit: filters.limit?.toString() || '20',
      });
      const res = await fetch(`/api/users?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    ...options,
  });
};

export const useUser = (id: string, options: QueryOptions<UserResponse>) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const res = await fetch(urls.api.users.detail(id));
      if (!res.ok) throw new Error('User not found');
      return res.json();
    },
    ...options,
  });
};

export const useUpdateUser = (
  id: string,
  input: PatchUserInput,
  options: UserMutationOptions = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(urls.api.users.detail(id), {
        method: 'POST',
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Failed to create user');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
  });
};

export const useDeleteUser = (
  id: string,
  options: UserMutationOptions = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(urls.api.users.detail(id), {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to create user');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
  });
};
