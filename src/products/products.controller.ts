import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { idSchema } from '../common/schemas/id.schema.js';
import {
  createProductSchema,
  type CreateProductDto,
} from './dto/create-product.dto.js';
import {
  findProductsQuerySchema,
  type FindProductsQueryDto,
} from './dto/find-products-query.dto.js';
import {
  updateProductSchema,
  type UpdateProductDto,
} from './dto/update-product.dto.js';
import type {
  CreateProductData,
  ProductEntity,
  ProductFilters,
  UpdateProductData,
} from './entities/product.entity.js';
import { ProductsService } from './products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @Body({ schema: createProductSchema }) body: CreateProductDto,
  ): Promise<ProductEntity> {
    const data: CreateProductData = body;
    return this.productsService.create(data);
  }

  @Get()
  findAll(
    @Query({ schema: findProductsQuerySchema }) query: FindProductsQueryDto,
  ): Promise<ProductEntity[]> {
    const filters: ProductFilters = query;
    return this.productsService.findAll(filters);
  }

  @Get(':id')
  findOne(
    @Param('id', { schema: idSchema }) id: string,
  ): Promise<ProductEntity> {
    return this.productsService.findByIdOrFail(id);
  }

  @Patch(':id')
  update(
    @Param('id', { schema: idSchema }) id: string,
    @Body({ schema: updateProductSchema }) body: UpdateProductDto,
  ): Promise<ProductEntity> {
    const data: UpdateProductData = body;
    return this.productsService.update({ id, data });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', { schema: idSchema }) id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
