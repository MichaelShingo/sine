import {
  type UseMutationOptions,
  QueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  CreateUserInput,
  PatchUserInput,
  UserResponse,
  UsersResponse,
} from '../lib/api/validation/users';

/** Extra options for user mutations (response is API JSON; variables are closed over, so `void`). */
type UserMutationOptions = Omit<
  UseMutationOptions<UserResponse, Error, void>,
  'mutationFn'
>;

// create
export const useCreateUser = (
  createUser: CreateUserInput,
  options: UserMutationOptions = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(createUser),
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

// read
export const useUsers = (
  filters: { page?: number; limit?: number } = {},
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

// is use suspense query better here?
export const useUser = (id: string, options: QueryOptions<UserResponse>) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error('User not found');
      return res.json();
    },
    ...options,
  });
};

// update
export const useUpdateUser = (
  id: string,
  updateUser: PatchUserInput,
  options: UserMutationOptions = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(updateUser),
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

// delete
export const useDeleteUser = (id: string, options: UserMutationOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/users${id}`, {
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
