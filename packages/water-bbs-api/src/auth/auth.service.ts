import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginDTO } from './dto';
import { Login, RefreshToken, RegisterCommand } from './application';
import { RegisterRequest } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly commandBus: CommandBus) {}
  login(dto: LoginDTO) {
    return this.commandBus.execute(
      new Login(
        dto.identType,
        dto.identValue,
        dto.credentialType,
        dto.credentialValue,
      ),
    );
  }
  async register(dto: RegisterRequest) {
    const id = await this.commandBus.execute(
      new RegisterCommand(
        dto.identType,
        dto.identValue,
        dto.credentialType,
        dto.credentialValue,
        dto.verificationCode,
        dto.profile.nick,
        dto.profile.bio,
      ),
    );
    if (id.isErr()) {
      return id;
    }
    return { accountId: id.value };
  }

  async refreshToken(refreshToken: string) {
    return this.commandBus.execute(new RefreshToken(refreshToken));
  }
}
