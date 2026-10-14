import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CategoryEntity,
  CreateCategoryData,
  UpdateCategoryParams,
} from './entities/category.entity.js';
import { CategoryRepository } from './repositories/category.repository.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(data: CreateCategoryData): Promise<CategoryEntity> {
    if (await this.categoryRepository.findByName(data.name)) {
      throw new ConflictException('Categoria já existe.');
    }
    return this.categoryRepository.create(data);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.findAll();
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    return this.categoryRepository.findById(id);
  }

  async findByIdOrFail(id: string): Promise<CategoryEntity> {
    const category: CategoryEntity | null = await this.findById(id);
    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }
    return category;
  }

  async update(params: UpdateCategoryParams): Promise<CategoryEntity> {
    const category = await this.findById(params.id);
    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }
    if (
      params.data.name &&
      params.data.name !== category.name &&
      (await this.categoryRepository.findByName(params.data.name))
    ) {
      throw new ConflictException('Categoria já existe.');
    }
    return this.categoryRepository.update(params.id, params.data);
  }

  async remove(id: string): Promise<void> {
    if (!(await this.findById(id))) {
      throw new NotFoundException('Categoria não encontrada.');
    }
    await this.categoryRepository.delete(id);
  }
}
