import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateRole } from './dto';
import {
  CreateRoleCommand,
  RemoveRoleCommand,
  UpdateRoleCommand,
} from './command';
import { RemoveRole } from './dto/remove-role.dto';
import { UpdateRole } from './dto/update-role.dto';
import { FindRole } from './dto/find-role.dto';
import { FindRoleQuery, ListRoleQuery } from './query';

@Injectable()
export class RoleService {
  constructor(
    private readonly qb: QueryBus,
    private readonly cb: CommandBus,
  ) {}
  createRole(role: CreateRole) {
    return this.cb.execute(
      new CreateRoleCommand(role.code, role.name, role.permissionCodes),
    );
  }

  removeRole(dto: RemoveRole) {
    return this.cb.execute(new RemoveRoleCommand(dto.id));
  }

  updateRole(id: string, dto: UpdateRole) {
    return this.cb.execute(
      new UpdateRoleCommand(id, dto.name, dto.permissionCodes),
    );
  }

  findRole(dto: FindRole) {
    return this.qb.execute(new FindRoleQuery(dto.code));
  }

  listRole(dto: ListRoleQuery) {
    return this.qb.execute(new ListRoleQuery(dto.page, dto.size));
  }
}
