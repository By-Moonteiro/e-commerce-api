import { CreateOrderData, OrderEntity } from '../entities/order.entity.js';

export abstract class OrderRepository {
  abstract create(data: CreateOrderData): Promise<OrderEntity>;
  abstract findAll(userId?: string): Promise<OrderEntity[]>;
  abstract findById(id: string): Promise<OrderEntity | null>;
  abstract cancel(id: string): Promise<OrderEntity>;
  abstract userExists(userId: string): Promise<boolean>;
}
