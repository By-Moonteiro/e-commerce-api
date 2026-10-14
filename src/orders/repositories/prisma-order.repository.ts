import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateOrderData, OrderEntity } from '../entities/order.entity.js';
import { OrderRepository } from './order.repository.js';

const orderInclude = {
  items: {
    include: {
      product: { select: { id: true, name: true } },
    },
  },
} satisfies Prisma.OrderInclude;

@Injectable()
export class PrismaOrderRepository extends OrderRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async userExists(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    return user !== null;
  }

  async create(data: CreateOrderData): Promise<OrderEntity> {
    const order = await this.prisma.$transaction(async (tx) => {
      // Busca os produtos para calcular o total e garantir os preços atuais
      const products = await tx.product.findMany({
        where: { id: { in: data.items.map((item) => item.productId) } },
      });

      const productsById = new Map(
        products.map((product) => [product.id, product]),
      );
      const itemsData: Array<{
        productId: string;
        quantity: number;
        unitPrice: Prisma.Decimal;
      }> = [];
      let total = new Prisma.Decimal(0);

      for (const item of data.items) {
        const product = productsById.get(item.productId)!;

        // Baixa o estoque no banco
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });

        total = total.plus(product.price.mul(item.quantity));
        itemsData.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
        });
      }

      return tx.order.create({
        data: {
          userId: data.userId,
          total,
          items: { createMany: { data: itemsData } },
        },
        include: orderInclude,
      });
    });

    return this.toEntity(order);
  }

  async findAll(userId?: string): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      where: userId ? { userId } : undefined,
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((order) => this.toEntity(order));
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    });
    return order ? this.toEntity(order) : null;
  }

  async cancel(id: string): Promise<OrderEntity> {
    const order = await this.prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status: 'CANCELED' },
        include: orderInclude,
      });

      // Devolve os itens ao estoque ao cancelar
      for (const item of updatedOrder.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return updatedOrder;
    });

    return this.toEntity(order);
  }

  private toEntity(
    order: Prisma.OrderGetPayload<{ include: typeof orderInclude }>,
  ): OrderEntity {
    return {
      ...order,
      status: order.status,
      total: order.total.toFixed(2),
      items: order.items.map((item) => ({
        ...item,
        unitPrice: item.unitPrice.toFixed(2),
      })),
    };
  }
}
