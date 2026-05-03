import { Aggregate, Fail, Ok } from 'types-ddd';
import { Cert, Ident, RoleCode } from '../vo';
import { DomainError } from '@app/shared';

export type AccountProp = {
  identities: Ident[];
  certs: Cert[];
  roles: RoleCode[];
  removed_at?: Date;
};

export class Account extends Aggregate<AccountProp> {
  constructor(prop: AccountProp) {
    super(prop);
  }
  findIdent(identType: string) {
    const identities = this.get('identities');
    return identities.filter((id) => id.get('ident_type') == identType);
  }
  remove() {
    if (this.get('removed_at')) {
      return Fail(new DomainError('ACCOUNT_ALREADY_REMOVED'));
    }
    this.set('removed_at').to(new Date());
    return Ok();
  }
  approveIdent(identType: string, identValue: string) {
    const [id] = this.findIdent(identType);
    if (!id) {
      return Fail(new DomainError('IDENTIFIER_NOT_FOUND'));
    }
    const identifier = new Ident({
      ident_type: identType,
      ident_value: identValue,
      verified: true,
    });
    const identities = this.get('identities').filter(
      (id) =>
        id.get('ident_type') !== identType &&
        id.get('ident_value') !== identValue,
    );
    identities.push(identifier);
    return Ok(
      new Account({
        ...this.toObject(),
        identities,
      }),
    );
  }
  hasRole(roleCode: RoleCode) {
    return this.get('roles').some((r) => r.isEqual(roleCode));
  }
  bindRole(role: RoleCode) {
    if (this.hasRole(role)) {
      return;
    }
    const roles = [...this.get('roles')];
    roles.push(role);
    this.set('roles').to(roles);
  }
  unbindRole(code: RoleCode) {
    if (!this.hasRole(code)) {
      return Fail(new DomainError('ROLE_NOT_FOUND'));
    }
    const permissions = [...this.get('roles').filter((p) => !p.isEqual(code))];
    this.set('roles').to(permissions);
    return Ok();
  }
}
