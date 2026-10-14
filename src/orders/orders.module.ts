import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { OrderRepository } from './repositories/order.repository.js';
import { PrismaOrderRepository } from './repositories/prisma-order.repository.js';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
  ],
})
export class OrdersModule {}
