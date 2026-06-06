import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { isEmpty } from 'radashi';
import { Account } from 'water-bbs-migration';
import { RoleKey } from '../decorator/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    @InjectRepository(Account)
    private accountRepository: EntityRepository<Account>,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const req: Request = http.getRequest();
    const requiredRole = this.reflector.get<string>(
      RoleKey,
      context.getHandler(),
    );
    if (!requiredRole) {
      return true;
    }
    if (!req.user || !req.user.account) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
    const accountId = req.user.account.id;
    const account = await this.accountRepository.findOne({
      id: accountId,
    });
    if (!account || isEmpty(account)) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
    if (!account.isRole(requiredRole)) {
      throw new HttpException('PERMISSION_DENIED', HttpStatus.FORBIDDEN);
    }
    return true;
  }
}
