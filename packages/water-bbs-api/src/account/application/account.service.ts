import { Injectable } from '@nestjs/common';
import {
  CreateAccountDTO,
  CreateAccountResponse,
} from '../domain/dto/create-account.dto';
import { AccountID } from '../domain';
import { Result, ApplicationServiceError, DomainError } from 'water-bbs-shared';
import {
  UpdateProfileDTO,
  UpdateProfileResponse,
} from '../domain/dto/update-profile.dto';
import { ResetPasswordDTO } from '../domain/dto/reset-password.dto';
import {
  RemoveAccountDTO,
  RemoveAccountResponse,
} from '../domain/dto/remove-account.dto';
import { PublicAccountInfo } from '../domain/dto/public-account-info';
import { GetProfileDTO } from '../domain/dto/get-profile.dto';
import { UpdatePassword } from '../domain/dto/update-password.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateAvatarResponse } from '../domain/dto/update-avatar.dto';
import {
  CreateAccountCommand,
  RemoveAccountCommand,
  ResetPasswordCommand,
  UpdatePasswordCommand,
  UpdateProfileCommand,
  UploadAvatarCommand,
} from './commands';
import {
  FindAccountQuery,
  GetProfileQuery,
  GetPermissionQuery,
} from './queries';

@Injectable()
export class AccountService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getPermission(
    accountID: string,
  ): Promise<Result<string[], ApplicationServiceError>> {
    return this.queryBus.execute(new GetPermissionQuery(accountID));
  }

  async createAccount(
    dto: CreateAccountDTO,
  ): Promise<Result<CreateAccountResponse, ApplicationServiceError>> {
    return this.commandBus.execute(new CreateAccountCommand(dto));
  }

  async removeAccount(
    dto: RemoveAccountDTO,
  ): Promise<Result<RemoveAccountResponse, DomainError>> {
    return this.commandBus.execute(new RemoveAccountCommand(dto));
  }

  async updateProfile(
    id: string,
    dto: UpdateProfileDTO,
  ): Promise<Result<UpdateProfileResponse, DomainError>> {
    return this.commandBus.execute(new UpdateProfileCommand(id, dto));
  }

  async updatePassword(
    dto: UpdatePassword & { accountID: AccountID | string },
  ): Promise<Result<boolean, DomainError>> {
    const accountID =
      dto.accountID instanceof AccountID
        ? dto.accountID.get('value')
        : dto.accountID;
    return this.commandBus.execute(
      new UpdatePasswordCommand({
        accountID,
        password: dto.password,
        mfaCode: dto.mfaCode,
      }),
    );
  }

  async resetPassword(
    dto: ResetPasswordDTO,
  ): Promise<Result<boolean, DomainError>> {
    return this.commandBus.execute(new ResetPasswordCommand(dto));
  }

  async findAccount(
    id: string,
  ): Promise<Result<PublicAccountInfo, DomainError>> {
    return this.queryBus.execute(new FindAccountQuery(id));
  }

  async getProfile(id: string): Promise<Result<GetProfileDTO, DomainError>> {
    return this.queryBus.execute(new GetProfileQuery(id));
  }

  async uploadAvatar(
    accountId: string,
    avatar: Express.Multer.File,
  ): Promise<Result<UpdateAvatarResponse, DomainError>> {
    return this.commandBus.execute(new UploadAvatarCommand(accountId, avatar));
  }
}
