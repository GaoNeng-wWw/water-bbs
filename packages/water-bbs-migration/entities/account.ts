import { Entity, PrimaryKey, Property, ManyToOne, OneToOne, OneToMany, ManyToMany, Unique } from '@mikro-orm/decorators/legacy';
import { v7 } from 'uuid';  
import { BaseMetaEntity } from './meta';
import { Collection } from '@mikro-orm/core';
import { Profile } from './profile';
import { Cert, Ident, IdentEnum } from './security';
import { DomainError, err, ok, Result } from 'water-bbs-shared';

@Entity()
export class Permission extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

  @Property({ index: true, nullable: false, type: 'char', length: 255 })
  code!: string;

  @Property({ index: true, nullable: false, type: 'char', length: 255 })
  name!: string;

  @ManyToMany(() => Role, role => role.permissions)
  roles = new Collection<Role>(this);


  constructor(
    code: string,
    name: string,
    roles: Role[] = []
  ){
    super();
    this.code = code;
    this.name = name;
    roles.forEach(r => this.roles.add(r));
  }
}

@Entity()
export class Role extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

  @Property({ index: true, nullable: false, type: 'char', length: 255 })
  code!: string;

  @Property({ index: true, nullable: false, type: 'char', length: 255 })
  name!: string;

  @ManyToMany(() => Permission, 'roles', { owner: true, pivotTable: 'role_permission' })
  permissions = new Collection<Permission>(this);

  @OneToMany(() => Account, account => account.role)
  accounts = new Collection<Account>(this);

  constructor(
    code: string, name: string,
    permissions: Permission[] = [],
    accounts: Account
  ){
    super();
    this.code = code;
    this.name = name;
    permissions.forEach(p => this.permissions.add(p));
    this.accounts.add(accounts);
  }

  bindPermission(permission: Permission){
    if (this.hasPermission(permission.code)) {
      return;
    }
    this.permissions.add(permission);
  }
  hasPermission(code: string) {
    return this.permissions.find(p => p.code === code) !== undefined;
  }
}

@Entity()
export class Account extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

  @ManyToOne(() => Role)
  role!: Role;

  @OneToOne(() => Profile, profile => profile.account, { owner: false })
  profile!: Profile;

  @OneToMany(() => Ident, ident => ident.account)
  idents = new Collection<Ident>(this);

  @OneToMany(() => Cert, cert => cert.account)
  certs = new Collection<Cert>(this);

  addCert(cert: Cert):Result<boolean, DomainError> {
    if (this.findCert(cert.certType).length) {
      return err(new DomainError('CERT_ALREADY_EXISTS'));
    }
    this.certs.add(cert);
    return ok(true);
  }
  addIdentity(ident: Ident):Result<boolean, DomainError> {
    if (this.findIdent(ident.identType).length) {
      return err(new DomainError('IDENTITY_ALREADY_EXISTS'));
    }
    this.idents.add(ident);
    return ok(true);
  }
  findIdent(identType: IdentEnum) {
    return this.idents.filter(id => id.identType === identType);
  }
  findCert(certType: string) {
    return this.certs.filter(cert => cert.certType === certType);
  }
}