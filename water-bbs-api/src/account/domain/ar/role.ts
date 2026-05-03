import { Aggregate, Fail, Ok } from 'types-ddd';
import { PermissionCode, RoleCode, RoleId } from '../vo';
import { DomainError } from '@app/shared';

export type RoleProp = {
  id: RoleId;
  code: RoleCode;
  name: string;
  permission: PermissionCode[];
};

export class Role extends Aggregate<RoleProp> {
  constructor(prop: RoleProp) {
    super(prop);
  }
  hasPermission(code: string) {
    return this.get('permission').filter((c) => c.get('value') === code);
  }
  bindPermission(code: PermissionCode) {
    if (this.get('permission').some((c) => c.isEqual(code))) {
      return;
    }
    const permissions = [...this.get('permission')];
    permissions.push(code);
    this.set('permission').to(permissions);
  }
  removePermission(code: PermissionCode) {
    if (!this.hasPermission(code.get('value'))) {
      return Fail(new DomainError('PERMISSION_NOT_FOUND', null, { code }));
    }
    const permissions = [
      ...this.get('permission').filter((p) => !p.isEqual(code)),
    ];
    this.set('permission').to(permissions);
    return Ok();
  }
}
