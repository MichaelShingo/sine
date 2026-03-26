export const urls = {
  home: () => '/',
  login: () => '/login',
  settings: () => '/settings',
  contracts: {
    list: () => '/contracts',
    detail: (id: string) => `/contracts/${id}`,
  },
  templates: {
    list: () => '/templates',
    detail: (id: string) => `/templates/${id}`,
  },
  api: {
    users: {
      list: () => '/api/users',
      detail: (id: string) => `/api/users/${id}`,
    },
    contracts: {
      list: () => '/api/contracts',
      detail: (id: string) => `/api/contracts/${id}`,
    },
    templates: {
      list: () => '/api/templates',
      detail: (id: string) => `/api/templates/${id}`,
    },
  },
};
