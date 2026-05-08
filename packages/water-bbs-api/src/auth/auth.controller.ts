import { Body, Controller, Delete, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body() body: LoginDTO) {
    return this.authService.login(
      body.ident_type,
      body.ident_value,
      body.cert_value,
    );
  }
  @Delete('logout')
  logout() {}
}
