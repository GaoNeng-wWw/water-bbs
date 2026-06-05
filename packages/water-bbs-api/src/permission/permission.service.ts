import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePermissionCommand, RemovePermissionCommand } from './commands';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { RemovePermission } from './dto/remove-permission.dto';
import { FindPermission, ListPermission } from './query';
import { isErr, ok } from 'water-bbs-shared';
import { Pagination } from '@app/shared';

@Injectable()
export class PermissionService {
  constructor(
    private readonly cb: CommandBus,
    private readonly qb: QueryBus,
  ) {}

  createPermission(dto: CreatePermissionDto) {
    return this.cb.execute(new CreatePermissionCommand(dto.code, dto.name));
  }

  removePermission(dto: RemovePermission) {
    return this.cb.execute(new RemovePermissionCommand(dto.id));
  }

  findPermission(code: string) {
    return this.qb.execute(new FindPermission(code));
  }
  async listPermission(page: number, size: number) {
    const permissionsRes = await this.qb.execute(
      new ListPermission(page, size),
    );
    if (isErr(permissionsRes)) {
      return permissionsRes;
    }
    const { permission, total } = permissionsRes.value;
    return ok(new Pagination(total, permission));
  }
}
