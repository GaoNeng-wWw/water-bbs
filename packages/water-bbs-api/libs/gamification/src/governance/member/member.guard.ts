import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MEMBER_KEY } from './member.decorator';
import { GovernanceMember, MemberKind } from './member.entity';
import { EntityManager } from '@mikro-orm/core';
import { AuthUser } from 'src/auth';
import { PermissionDeniedError } from '@app/shared';

@Injectable()
export class MemberGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly repo: EntityManager,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const handler = context.getHandler();
    const memberKind = this.reflector.getAllAndOverride<MemberKind>(
      MEMBER_KEY,
      [handler],
    );
    if (!memberKind) {
      return true;
    }
    const req = http.getRequest();
    const user: AuthUser = req.user;
    const accountId = user.id;
    const member = await this.repo.findOne(GovernanceMember,{
      accountId: accountId,
      kind: memberKind,
      $or: [{ endedAt: null }, { endedAt: { $gt: new Date() } }],
    });
    if (!member) {
      throw new PermissionDeniedError();
    }
    return true;
  }
}
