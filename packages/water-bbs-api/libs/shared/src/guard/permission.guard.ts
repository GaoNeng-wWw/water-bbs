import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Account } from 'water-bbs-migration';
import { PERMISSION_METADATA_KEY } from '../decorator';
import { isEmpty } from 'radashi';
import { Request } from 'express';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    @InjectRepository(Account)
    private accountRepository: EntityRepository<Account>,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requriedPermission = this.reflector.get<string[]>(
      PERMISSION_METADATA_KEY,
      context.getHandler(),
    );
    if (!requriedPermission || isEmpty(requriedPermission)) {
      return true;
    }
    const http = context.switchToHttp();
    const req: Request = http.getRequest();
    if (!req.user.account) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
    const accountId = req.user.account.id;
    const account = await this.accountRepository.findOne({
      id: accountId,
    });
    if (!account || isEmpty(account)) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
    if (account.hasPermission('*')) {
      return true;
    }
    if (requriedPermission.some((item) => !account.hasPermission(item))) {
      throw new HttpException('PERMISSION_DENIED', HttpStatus.FORBIDDEN);
    }
    return true;
  }
}
