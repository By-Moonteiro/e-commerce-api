import {
  CreateProductData,
  ProductEntity,
  ProductFilters,
  UpdateProductData,
} from '../entities/product.entity.js';

export abstract class ProductRepository {
  abstract create(data: CreateProductData): Promise<ProductEntity>;
  abstract findAll(filters: ProductFilters): Promise<ProductEntity[]>;
  abstract findById(id: string): Promise<ProductEntity | null>;
  abstract update(id: string, data: UpdateProductData): Promise<ProductEntity>;
  abstract delete(id: string): Promise<void>;
  abstract categoryExists(categoryId: string): Promise<boolean>;
}
