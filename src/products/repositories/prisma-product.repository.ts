import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreateProductData,
  ProductEntity,
  ProductFilters,
  UpdateProductData,
} from '../entities/product.entity.js';
import { ProductRepository } from './product.repository.js';

const productInclude = {
  category: { select: { id: true, name: true } },
} satisfies Prisma.ProductInclude;

@Injectable()
export class PrismaProductRepository extends ProductRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateProductData): Promise<ProductEntity> {
    const product = await this.prisma.product.create({
      data,
      include: productInclude,
    });
    return { ...product, price: product.price.toFixed(2) };
  }

  async findAll(filters: ProductFilters): Promise<ProductEntity[]> {
    const where: Prisma.ProductWhereInput = {
      categoryId: filters.categoryId,
      name: filters.search
        ? { contains: filters.search, mode: 'insensitive' }
        : undefined,
    };
    const products = await this.prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: { createdAt: 'desc' },
    });
    return products.map((product): ProductEntity => ({
      ...product,
      price: product.price.toFixed(2),
    }));
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });
    return product ? { ...product, price: product.price.toFixed(2) } : null;
  }

  async update(id: string, data: UpdateProductData): Promise<ProductEntity> {
    const product = await this.prisma.product.update({
      where: { id },
      data,
      include: productInclude,
    });
    return { ...product, price: product.price.toFixed(2) };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  async categoryExists(categoryId: string): Promise<boolean> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
    return category !== null;
  }
}
