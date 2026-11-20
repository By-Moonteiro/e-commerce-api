import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';
import type { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

vi.mock('argon2', () => ({
  verify: vi.fn(),
}));

import * as argon2 from 'argon2';

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Login', () => {
    it('deve realizar login com credenciais válidas', async () => {
      const user = {
        id: 'user-123',
        email: 'user@test.com',
        password: 'hashed-password',
      };

      const usersService = {
        findCredentialsByEmail: vi.fn().mockResolvedValue(user),
      } as unknown as UsersService;

      vi.mocked(argon2.verify).mockResolvedValue(true);

      const jwtService = {
        signAsync: vi.fn().mockResolvedValue('fake.jwt.token'),
      } as unknown as JwtService;

      const authService = new AuthService(jwtService, usersService);

      const result = await authService.login('user@test.com', 'password123');

      expect(result).toEqual({
        accessToken: 'fake.jwt.token',
      });

      expect(usersService.findCredentialsByEmail).toHaveBeenCalledWith(
        'user@test.com',
      );

      expect(argon2.verify).toHaveBeenCalledWith(
        'hashed-password',
        'password123',
      );

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 'user-123',
        email: 'user@test.com',
      });
    });

    it('deve lançar uma exceção quando o usuário não for encontrado', async () => {
      const usersService = {
        findCredentialsByEmail: vi.fn().mockResolvedValue(null),
      } as unknown as UsersService;

      const jwtService = {
        signAsync: vi.fn(),
      } as unknown as JwtService;

      const authService = new AuthService(jwtService, usersService);

      await expect(
        authService.login('unknown@test.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);

      expect(jwtService.signAsync).not.toHaveBeenCalled();

      expect(argon2.verify).not.toHaveBeenCalled();
    });

    it('deve lançar uma exceção quando a senha estiver incorreta', async () => {
      const user = {
        id: 'user-123',
        email: 'user@test.com',
        password: 'hashed-password',
      };

      const usersService = {
        findCredentialsByEmail: vi.fn().mockResolvedValue(user),
      } as unknown as UsersService;

      const jwtService = {
        signAsync: vi.fn(),
      } as unknown as JwtService;

      vi.mocked(argon2.verify).mockResolvedValue(false);

      const authService = new AuthService(jwtService, usersService);

      await expect(
        authService.login('user@test.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);

      expect(argon2.verify).toHaveBeenCalledWith(
        'hashed-password',
        'wrong-password',
      );

      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('Tokens', () => {
    it('deve assinar um token de acesso', async () => {
      const jwtService = {
        signAsync: vi.fn().mockResolvedValue('fake.jwt.token'),
      } as unknown as JwtService;

      const usersService = {} as UsersService;

      const authService = new AuthService(jwtService, usersService);

      const payload = {
        sub: 'user-123',
        email: 'user@test.com',
      };

      const token = await authService.signAccessToken(payload);

      expect(token).toBe('fake.jwt.token');
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
    });

    it('deve verificar um token de acesso', async () => {
      const jwtService = {
        verifyAsync: vi.fn().mockResolvedValue({
          sub: 'user-123',
          email: 'user@test.com',
        }),
      } as unknown as JwtService;

      const usersService = {} as UsersService;

      const authService = new AuthService(jwtService, usersService);

      const payload = await authService.verifyAccessToken('fake.jwt.token');

      expect(payload).toEqual({
        sub: 'user-123',
        email: 'user@test.com',
      });

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('fake.jwt.token');
    });

    it('deve lançar uma exceção quando a verificação do token falhar', async () => {
      const jwtService = {
        verifyAsync: vi.fn().mockRejectedValue(new Error('Invalid token')),
      } as unknown as JwtService;

      const usersService = {} as UsersService;

      const authService = new AuthService(jwtService, usersService);

      await expect(
        authService.verifyAccessToken('invalid.token'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
