import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import {
  type CreateUserDTO,
  type UpdateUserDTO,
  createUserSchema,
  updateUserSchema,
} from './dto/user.schema.js';
import { UserEntity } from './entities/user.entity.js';
import { idSchema } from '../common/schemas/id.schema.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body({ schema: createUserSchema }) data: CreateUserDTO,
  ): Promise<UserEntity> {
    return this.usersService.create(data);
  }

  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findById(@Param('id', { schema: idSchema }) id: string): Promise<UserEntity> {
    return this.usersService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id', { schema: idSchema }) id: string,
    @Body({ schema: updateUserSchema }) data: UpdateUserDTO,
  ): Promise<UserEntity> {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', { schema: idSchema }) id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
