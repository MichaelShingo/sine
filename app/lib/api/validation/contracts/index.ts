import { z } from 'zod';

const contractShape = z.object({
  name: z.string().nullable(),
  deadline: z.coerce.date().nullable(),
  signerName: z.string().nullable(),
  signerEmail: z.string().nullable(),
  content: z.json(),
  signedDate: z.coerce.date().nullable(),
  sent: z.boolean().optional(),
  /** FK to `Template.id`; set to `null` to detach the template */
  templateId: z.number().int().nullable(),
});

export type Contract = z.infer<typeof contractShape>;

export const createContractSchema = contractShape; // omit or extend as needed
export type CreateContractInput = z.infer<typeof createContractSchema>;

export const updateContractSchema = contractShape.partial(); // optional fields
export type UpdateContractInput = z.infer<typeof updateContractSchema>;

export const getContractSchema = z.object({
  // filters
  searchTerm: z.string().optional(),
  deadlineIsBefore: z.coerce.date().optional(),
  deadlineIsAfter: z.coerce.date().optional(),
  signedDateIsBefore: z.coerce.date().optional(),
  signedDateIsAfter: z.coerce.date().optional(),
  isSent: z.boolean().optional(),
  templateId: z.number().optional(),

  // pagination
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  cursor: z.string().optional(),

  // sorting
  sortBy: z
    .enum([
      'name',
      'deadline',
      'signerName',
      'signerEmail',
      'createdAt',
      'signedDate',
      'sent',
      'updatedAt',
    ])
    .default('createdAt'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
});
export type GetContractInput = z.infer<typeof getContractSchema>;

/** Full row for API responses — writable fields plus server-managed columns */
export const contractResponseSchema = contractShape.extend({
  id: z.number().int(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type ContractResponse = z.infer<typeof contractResponseSchema>;

export const contractsResponseSchema = z.object({
  data: z.array(contractResponseSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    cursor: z.string().nullable(),
  }),
});
export type ContractsResponse = z.infer<typeof contractsResponseSchema>;
