import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RefreshTokenDTO, TokenPair } from './dto';
import { RegisterRequest, RegisterResponse } from './dto/register.dto';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { Public } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '登陆账号, 并且签发一个新的令牌对',
    operationId: 'login',
  })
  @Public()
  @ApiBody({ type: LoginDTO })
  @ApiCreatedResponse({ type: TokenPair })
  @Post('login')
  async login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }

  @ApiOperation({ summary: '注册账号', operationId: 'register' })
  @Public()
  @ApiBody({ type: RegisterRequest })
  @ApiCreatedResponse({ type: RegisterResponse })
  @Post('register')
  async register(@Body() body: RegisterRequest) {
    return this.authService.register(body);
  }

  @ApiOperation({ summary: '获得一个新的令牌对', operationId: 'refreshToken' })
  @Public()
  @ApiCreatedResponse({ type: TokenPair })
  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDTO) {
    return this.authService.refreshToken(body.token);
  }
}
