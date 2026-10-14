import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderData, OrderEntity } from './entities/order.entity.js';
import { OrderRepository } from './repositories/order.repository.js';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly prisma: PrismaService, // Para consultar produtos e validar estoques na regra de negócio
  ) {}

  async create(data: CreateOrderData): Promise<OrderEntity> {
    if (!(await this.orderRepository.userExists(data.userId))) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    // 2. Valida se os produtos existem e se há estoque suficiente
    const productIds = data.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productsMap = new Map(products.map((p) => [p.id, p]));

    for (const item of data.items) {
      const product = productsMap.get(item.productId);
      if (!product) {
        throw new NotFoundException(
          `Produto ${item.productId} não encontrado.`,
        );
      }
      if (product.stock < item.quantity) {
        throw new ConflictException(
          `Estoque insuficiente para o produto "${product.name}".`,
        );
      }
    }

    return this.orderRepository.create(data);
  }

  findAll(userId?: string): Promise<OrderEntity[]> {
    return this.orderRepository.findAll(userId);
  }

  async findByIdOrFail(id: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }
    return order;
  }

  async cancel(id: string): Promise<OrderEntity> {
    const order = await this.findByIdOrFail(id);

    if (order.status !== 'PENDING') {
      throw new ConflictException(
        'Apenas pedidos pendentes podem ser cancelados.',
      );
    }

    return this.orderRepository.cancel(id);
  }
}
