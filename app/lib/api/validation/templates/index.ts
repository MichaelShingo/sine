import z from 'zod';

const templateShape = z.object({
  name: z.string().nullable(),
  content: z.json(),
  placeholders: z.array(z.string()),
});

export type Template = z.infer<typeof templateShape>;

export const createTemplateSchema = templateShape;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;

export const updateTemplateSchema = templateShape.partial();
export type updateTemplateInput = z.infer<typeof updateTemplateSchema>;

export const getTemplateSchema = z.object({
  // filters
  searchTerm: z.string().optional(),

  // sorting
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).default('name'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
});
export type GetTemplateInput = z.infer<typeof getTemplateSchema>;

export const templateResponseSchema = templateShape.extend({
  id: z.number().int(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  contracts: z.array(
    z.object({
      id: z.number().int(),
      name: z.string(),
    }),
  ),
});
export type TemplateResponse = z.infer<typeof templateResponseSchema>;

export const templatesResponseSchema = z.array(
  templateResponseSchema.omit(['contracts']),
);
