// src/modules/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository.js';
import {
  CreateUserData,
  UpdateUserData,
  UserEntity,
} from './entities/user.entity.js';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: CreateUserData): Promise<UserEntity> {
    const exists = await this.userRepository.findByEmail(data.email);
    if (exists) {
      throw new ConflictException('E-mail já está em uso.');
    }

    const hashedPassword: string = await argon2.hash(data.password);
    return this.userRepository.create({ ...data, password: hashedPassword });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return user;
  }

  async update(id: string, data: UpdateUserData): Promise<UserEntity> {
    await this.findById(id);
    const hashedData: UpdateUserData = {
      ...data,
      ...(data.password ? { password: await argon2.hash(data.password) } : {}),
    };
    return this.userRepository.update(id, hashedData);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.userRepository.delete(id);
  }
}
