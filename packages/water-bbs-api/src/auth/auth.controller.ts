import { Body, Controller, Delete, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { Public, Token, User } from '@app/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  login(@Body() body: LoginDTO) {
    return this.authService.login(
      body.ident_type,
      body.ident_value,
      body.cert_value,
    );
  }

  @Delete('logout')
  logout(@User() user: RequestUser) {
    return this.authService.logout(user.account.id, user.token.jti);
  }

  @Post('refresh')
  refreshToken(@User() user: RequestUser, @Token() refreshTokenValue: string) {
    return this.authService.refresh(user.account.id, refreshTokenValue);
  }
}
