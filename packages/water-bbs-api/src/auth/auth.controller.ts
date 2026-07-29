import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto';
import { RegisterRequest } from './dto/register.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiBody({ type: LoginDTO })
  @Post('login')
  async login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }
  @ApiBody({ type: RegisterRequest })
  @Post('register')
  async register(@Body() body: RegisterRequest) {
    return this.authService.register(body);
  }
}
