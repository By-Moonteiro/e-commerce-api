import { z } from 'zod';

export const createOrderItemSchema = z.object({
  productId: z.uuid('productId deve ser um UUID válido'),
  quantity: z
    .number()
    .int('Quantidade deve ser um número inteiro')
    .positive()
    .max(1000),
});

export type CreateOrderItemDto = z.infer<typeof createOrderItemSchema>;

export const createOrderSchema = z.object({
  userId: z.uuid('userId deve ser um UUID válido'),
  items: z
    .array(createOrderItemSchema)
    .min(1, 'O pedido precisa ter ao menos 1 item')
    .refine(
      (items: CreateOrderItemDto[]): boolean =>
        new Set(items.map((item: CreateOrderItemDto): string => item.productId))
          .size === items.length,
      'Não repita o mesmo produto: some as quantidades em um único item',
    ),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
