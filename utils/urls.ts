import { GetContractInput } from '@/app/lib/api/validation/contracts';
import { GetTemplateInput } from '@/app/lib/api/validation/templates';

type QueryRecord = Record<
  string,
  string | number | boolean | Date | undefined | null
>;

const appendQuery = (path: string, query?: QueryRecord): string => {
  if (!query) return path;
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value != null && value !== '') sp.set(key, String(value));
  }
  const qs = sp.toString();
  return qs ? `${path}?${qs}` : path;
};

export const urls = {
  home: () => '/',
  login: () => '/login',
  settings: () => '/settings',
  contracts: {
    list: () => '/contracts',
    detail: (id: number) => `/contracts/${id}`,
  },
  templates: {
    list: () => '/templates',
    detail: (id: number) => `/templates/${id}`,
  },
  api: {
    users: {
      list: () => '/api/users',
      detail: (id: string) => `/api/users/${id}`,
    },
    contracts: {
      list: (filters?: Partial<GetContractInput>) =>
        appendQuery('/api/contracts', filters),
      detail: (id: number) => `/api/contracts/${id}`,
    },
    templates: {
      list: (filters?: Partial<GetTemplateInput>) =>
        appendQuery('/api/templates', filters),
      detail: (id: number) => `/api/templates/${id}`,
    },
  },
};
