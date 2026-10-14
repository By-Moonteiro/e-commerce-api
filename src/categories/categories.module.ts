import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller.js';
import { CategoriesService } from './categories.service.js';
import { CategoryRepository } from './repositories/category.repository.js';
import { PrismaCategoryRepository } from './repositories/prisma-category.repository.js';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    { provide: CategoryRepository, useClass: PrismaCategoryRepository },
  ],
})
export class CategoriesModule {}
