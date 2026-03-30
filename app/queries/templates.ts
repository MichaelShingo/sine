import {
  QueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  CreateTemplateInput,
  GetTemplateInput,
  TemplateResponse,
  TemplatesResponse,
  UpdateTemplateInput,
} from '../lib/api/validation/templates';
import { urls } from '@/utils/urls';

type TemplateMutationOptions = Omit<
  UseMutationOptions<TemplateResponse, Error, void>,
  'mutationFn'
>;

type TemplateDeleteMutationOptions = Omit<
  UseMutationOptions<void, Error, void>,
  'mutationFn'
>;

const jsonHeaders = { 'Content-Type': 'application/json' } as const;

export const useCreateTemplate = (
  input: CreateTemplateInput,
  options: TemplateMutationOptions = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(urls.api.templates.list(), {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Failed to create template');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
  });
};

export const useTemplates = (
  filters: Partial<GetTemplateInput>,
  options: QueryOptions<TemplatesResponse> = {},
) => {
  return useQuery({
    queryKey: ['templates', filters],
    queryFn: async () => {
      const res = await fetch(urls.api.templates.list(filters));
      if (!res.ok) throw new Error('Failed to fetch templates');
      return res.json();
    },
    ...options,
  });
};

export const useTemplate = (
  id: number,
  options: QueryOptions<TemplateResponse> = {},
) => {
  return useQuery({
    queryKey: ['template', id],
    queryFn: async () => {
      const res = await fetch(urls.api.templates.detail(id));
      if (!res.ok) throw new Error('Failed to fetch template');
      return res.json();
    },
    ...options,
  });
};

export const useUpdateTemplate = (
  id: number,
  input: UpdateTemplateInput,
  options: TemplateMutationOptions = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(urls.api.templates.detail(id), {
        method: 'PATCH',
        headers: jsonHeaders,
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Failed to update template');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({ queryKey: ['template', id] });
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
  });
};

export const useDeleteTemplate = (
  id: number,
  options: TemplateDeleteMutationOptions = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(urls.api.templates.detail(id), {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete template');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.removeQueries({ queryKey: ['template', id] });
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
  });
};
