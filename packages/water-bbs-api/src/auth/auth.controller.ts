import { Body, Controller, Delete, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, LoginResponse } from './dto/login.dto';
import { Public, Token, User } from '@app/shared';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  @ApiCreatedResponse({
    type: LoginResponse,
    description: 'Login Account. Will retun TokenPair.'
  })
  login(@Body() body: LoginDTO) {
    return this.authService.login(
      body.ident_type,
      body.ident_value,
      body.cert_value,
    );
  }

  @Delete('logout')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Logout account. Extract accountID from AccessToken',
  })
  logout(@User() user: RequestUser) {
    return this.authService.logout(user.account.id, user.token.jti);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: LoginResponse,
    description:
      'Refresh Token. It will return new TokenPair. Should put refreshToken on header.',
  })
  refreshToken(@User() user: RequestUser, @Token() refreshTokenValue: string) {
    return this.authService.refresh(user.account.id, refreshTokenValue);
  }
}
