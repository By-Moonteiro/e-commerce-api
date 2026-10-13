import {
  CreateUserData,
  UpdateUserData,
  UserCredentials,
  UserEntity,
} from '../entities/user.entity.js';

export abstract class UserRepository {
  abstract create(data: CreateUserData): Promise<UserEntity>;
  abstract findAll(): Promise<UserEntity[]>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findCredentialsByEmail(
    email: string,
  ): Promise<UserCredentials | null>;
  abstract update(id: string, data: UpdateUserData): Promise<UserEntity>;
  abstract delete(id: string): Promise<void>;
}
