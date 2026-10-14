import { z } from 'zod';

export const findOrdersQuerySchema = z.object({
  userId: z.uuid('userId deve ser um UUID válido').optional(),
});

export type FindOrdersQueryDto = z.infer<typeof findOrdersQuerySchema>;
