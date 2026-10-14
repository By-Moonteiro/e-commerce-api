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
} from '@nestjs/common';
import { idSchema } from '../common/schemas/id.schema.js';
import { CategoriesService } from './categories.service.js';
import {
  createCategorySchema,
  type CreateCategoryDto,
} from './dto/create-category.dto.js';
import {
  updateCategorySchema,
  type UpdateCategoryDto,
} from './dto/update-category.dto.js';
import type {
  CategoryEntity,
  CreateCategoryData,
  UpdateCategoryData,
} from './entities/category.entity.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Body({ schema: createCategorySchema }) data: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoriesService.create(data);
  }

  @Get()
  findAll(): Promise<CategoryEntity[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', { schema: idSchema }) id: string,
  ): Promise<CategoryEntity> {
    return this.categoriesService.findByIdOrFail(id);
  }

  @Patch(':id')
  update(
    @Param('id', { schema: idSchema }) id: string,
    @Body({ schema: updateCategorySchema }) data: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoriesService.update({ id, data });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', { schema: idSchema }) id: string): Promise<void> {
    return this.categoriesService.remove(id);
  }
}
