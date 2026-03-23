import { z } from 'zod';

const userShape = z.object({
  name: z.string().nullable(),
  email: z.email().min(1),
  image: z.url().nullable(),
});

export type User = z.infer<typeof userShape>;

export const createUserSchema = userShape; // omit or extend as needed
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const patchUserSchema = userShape.partial();
export type PatchUserInput = z.infer<typeof patchUserSchema>;

export const queryUserSchema = z.object({
  // filters
  name: z.string().min(1),
  email: z.email().min(1),

  // pagination
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  cursor: z.string().optional(),

  // sorting
  sortBy: z.enum(['name', 'email', 'createdAt', 'updatedAt']).default('email'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
});
export type QueryUserInput = z.infer<typeof queryUserSchema>;

export const userResponseSchema = userShape; // omit as necessary
export type UserResponse = z.infer<typeof userResponseSchema>;

export const usersResponseSchema = z.object({
  data: z.array(userResponseSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    cursor: z.string().nullable(),
  }),
});
export type UsersResponse = z.infer<typeof usersResponseSchema>;
