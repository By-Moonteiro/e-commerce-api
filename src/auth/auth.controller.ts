import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { loginSchema, type LoginDTO } from './dto/login.schema.js';
import { Public } from './decorators/public.decorator.js';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @ApiOperation({ security: [] })
  @Public()
  @Post('login')
  async login(
    @Body({ schema: loginSchema })
    data: LoginDTO,
  ) {
    return this.authService.login(data.email, data.password);
  }
}
