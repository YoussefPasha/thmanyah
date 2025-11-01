import { z } from 'zod';

export const searchSchema = z.object({
  term: z.string().min(2, 'Search term must be at least 2 characters'),
  limit: z.number().min(1).max(200).optional(),
  offset: z.number().min(0).optional(),
  country: z.string().length(2).optional(),
});

export type SearchFormData = z.infer<typeof searchSchema>;

