import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UserRepository } from './user.repository.js';
import {
  CreateUserData,
  UpdateUserData,
  UserEntity,
} from '../entities/user.entity.js';

const publicUser = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData): Promise<UserEntity> {
    return await this.prisma.user.create({
      data,
      select: publicUser,
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.prisma.user.findMany({
      select: publicUser,
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      select: publicUser,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.prisma.user.findUnique({
      where: { email },
      select: publicUser,
    });
  }

  async findCredentialsByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: UpdateUserData): Promise<UserEntity> {
    return await this.prisma.user.update({
      where: { id },
      data,
      select: publicUser,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
