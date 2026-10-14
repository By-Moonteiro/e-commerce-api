import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { idSchema } from '../common/schemas/id.schema.js';
import {
  createOrderSchema,
  type CreateOrderDto,
} from './dto/create-order.dto.js';
import {
  findOrdersQuerySchema,
  type FindOrdersQueryDto,
} from './dto/find-orders-query.dto.js';
import type { OrderEntity } from './entities/order.entity.js';
import { OrdersService } from './orders.service.js';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Body({ schema: createOrderSchema }) data: CreateOrderDto,
  ): Promise<OrderEntity> {
    return this.ordersService.create(data);
  }

  @Get()
  findAll(
    @Query({ schema: findOrdersQuerySchema }) query: FindOrdersQueryDto,
  ): Promise<OrderEntity[]> {
    return this.ordersService.findAll(query.userId);
  }

  @Get(':id')
  findOne(@Param('id', { schema: idSchema }) id: string): Promise<OrderEntity> {
    return this.ordersService.findByIdOrFail(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id', { schema: idSchema }) id: string): Promise<OrderEntity> {
    return this.ordersService.cancel(id);
  }
}
