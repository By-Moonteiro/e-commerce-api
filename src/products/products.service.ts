import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateProductData,
  ProductEntity,
  ProductFilters,
  UpdateProductData,
} from './entities/product.entity.js';
import { ProductRepository } from './repositories/product.repository.js';

interface UpdateProductParams {
  id: string;
  data: UpdateProductData;
}

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(data: CreateProductData): Promise<ProductEntity> {
    if (!(await this.productRepository.categoryExists(data.categoryId))) {
      throw new NotFoundException('Categoria não encontrada.');
    }
    return this.productRepository.create(data);
  }

  async findAll(filters: ProductFilters): Promise<ProductEntity[]> {
    return this.productRepository.findAll(filters);
  }

  async findByIdOrFail(id: string): Promise<ProductEntity> {
    const product: ProductEntity | null =
      await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }
    return product;
  }

  async update(params: UpdateProductParams): Promise<ProductEntity> {
    if (!(await this.productRepository.findById(params.id))) {
      throw new NotFoundException('Produto não encontrado.');
    }
    if (
      params.data.categoryId &&
      !(await this.productRepository.categoryExists(params.data.categoryId))
    ) {
      throw new NotFoundException('Categoria não encontrada.');
    }
    return this.productRepository.update(params.id, params.data);
  }

  async remove(id: string): Promise<void> {
    if (!(await this.productRepository.findById(id))) {
      throw new NotFoundException('Produto não encontrado.');
    }
    await this.productRepository.delete(id);
  }
}
