import { Entity, PrimaryKey, Property, ManyToOne, OneToOne, OneToMany, ManyToMany, Unique } from '@mikro-orm/decorators/legacy';
import { v7 } from 'uuid';  
import { BaseMetaEntity } from './meta';
import { Cascade, Collection } from '@mikro-orm/core';
import { Profile } from './profile';
import { Cert, CertEnum, Ident, IdentEnum } from './security';
import { DomainError, err, ok, Result } from 'water-bbs-shared';
import { hashSync } from 'bcryptjs';

@Entity()
export class Account extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

  @ManyToOne(() => Role, {nullable: true, cascade: [Cascade.MERGE]})
  role: Role | null = null;

  @OneToOne(() => Profile, profile => profile.account, { owner: false})
  profile!: Profile;

  @OneToMany(() => Ident, ident => ident.account, {cascade: [Cascade.PERSIST, Cascade.MERGE], orphanRemoval: true})
  idents = new Collection<Ident>(this);

  @OneToMany(() => Cert, cert => cert.account, {cascade: [Cascade.PERSIST, Cascade.MERGE], orphanRemoval: true })
  certs = new Collection<Cert>(this);

  constructor(){
    super();
  }

  static create(
    idents: Ident[],
    certs: Cert[],
    role: Role,
    profile: Profile,
  ){
    const account = new Account();
    account.role = role;
    account.profile = profile;
    account.idents = new Collection<Ident>(account);
    account.certs = new Collection<Cert>(account);
  }

  isRole(code: string){
    if (!this.role) {
      return false;
    }
    return this.role.code === code;
  }
  hasPermission(code: string){
    if (!this.role) {
      return false;
    }
    return this.role.permissions.find(p => p.code === code);
  }
  addCert(cert: Cert):Result<boolean, DomainError> {
    if (this.findCert(cert.certType)) {
      return err(new DomainError('CERT_ALREADY_EXISTS'));
    }
    this.certs.add(cert);
    return ok(true);
  }
  addIdentity(ident: Ident):Result<boolean, DomainError> {
    if (this.findIdent(ident.identType)) {
      return err(new DomainError('IDENTITY_ALREADY_EXISTS'));
    }
    this.idents.add(ident);
    return ok(true);
  }
  findIdent(identType: IdentEnum) {
    return this.idents.filter(id => id.identType === identType)[0];
  }
  findCert(certType: CertEnum) {
    return this.certs.filter(cert => cert.certType === certType)[0];
  }
  removeCert(cert: Cert){
    this.certs.remove(cert);
  }
  isRemoved(){
    return !!this.removedAt;
  }
  remove(){
    if (this.isRemoved()) {
      return err(new DomainError('ACCOUNT_ALREADY_REMOVED'))
    }
    this.removedAt = new Date();
    return ok(true);
  }
  resetPassword(password: string){
    const passwordCert = this.findCert(CertEnum.PASSWORD);
    if (!passwordCert) {
      return err(new DomainError('PASSWORD_CERT_NOT_FOUND'));
    }
    this.removeCert(passwordCert);
    const newCert = new Cert({
      account: this,
      certType: CertEnum.PASSWORD,
      certValue: hashSync(password, 10),
    })
    this.addCert(newCert);
    return ok(true);
  }
}

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

  static create(code: string, name: string){
    return new Permission(code, name);
  }

  remove(){
    this.removedAt = new Date();
    return ok(true);
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
    account?: Account
  ){
    super();
    this.code = code;
    this.name = name;
    permissions.forEach(p => this.permissions.add(p));
    if (account){
      this.accounts.add(account);
    }
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

  static create(code: string, name: string, permissions: Permission[] = [], account?: Account){
    return new Role(code, name, permissions, account);
  }

  remove(){
    this.removedAt = new Date();
  }

  setPermission(permissions: Permission[]){
    this.permissions = new Collection(permissions);
  }
}