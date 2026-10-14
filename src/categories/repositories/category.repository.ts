import {
  CategoryEntity,
  CreateCategoryData,
  UpdateCategoryData,
} from '../entities/category.entity.js';

export abstract class CategoryRepository {
  abstract create(data: CreateCategoryData): Promise<CategoryEntity>;
  abstract findAll(): Promise<CategoryEntity[]>;
  abstract findById(id: string): Promise<CategoryEntity | null>;
  abstract findByName(name: string): Promise<CategoryEntity | null>;
  abstract update(
    id: string,
    data: UpdateCategoryData,
  ): Promise<CategoryEntity>;
  abstract delete(id: string): Promise<void>;
}
