import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CategoryEntity,
  CreateCategoryData,
  UpdateCategoryData,
} from '../entities/category.entity.js';
import { CategoryRepository } from './category.repository.js';

@Injectable()
export class PrismaCategoryRepository extends CategoryRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  create(data: CreateCategoryData): Promise<CategoryEntity> {
    return this.prisma.category.create({ data });
  }

  findAll(): Promise<CategoryEntity[]> {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  findById(id: string): Promise<CategoryEntity | null> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  findByName(name: string): Promise<CategoryEntity | null> {
    return this.prisma.category.findUnique({ where: { name } });
  }

  update(id: string, data: UpdateCategoryData): Promise<CategoryEntity> {
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }
}
