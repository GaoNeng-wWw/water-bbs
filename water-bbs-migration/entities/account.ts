import { Entity, PrimaryKey, Property, ManyToOne, OneToOne, OneToMany, ManyToMany, Unique } from '@mikro-orm/decorators/legacy';
import { v7 } from 'uuid';  
import { BaseMetaEntity } from './meta';
import { Collection } from '@mikro-orm/core';
import { ProfileEntity } from './profile';
import { CertEntity, IdentEntity } from './security';

@Entity()
export class PermissionEntity extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

  @Property({ index: true, nullable: false, type: 'char', length: 255 })
  code!: string;

  @Property({ index: true, nullable: false, type: 'char', length: 255 })
  name!: string;

  @ManyToMany(() => RoleEntity, role => role.permissions)
  roles = new Collection<RoleEntity>(this);
}

@Entity()
export class RoleEntity extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

  @Property({ index: true, nullable: false, type: 'char', length: 255 })
  code!: string;

  @Property({ index: true, nullable: false, type: 'char', length: 255 })
  name!: string;

  @ManyToMany(() => PermissionEntity, 'roles', { owner: true, pivotTable: 'role_permission' })
  permissions = new Collection<PermissionEntity>(this);

  @OneToMany(() => AccountEntity, account => account.role)
  accounts = new Collection<AccountEntity>(this);
}

@Entity()
export class AccountEntity extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

  @ManyToOne(() => RoleEntity)
  role!: RoleEntity;

  @OneToOne(() => ProfileEntity, profile => profile.account, { owner: false })
  profile!: ProfileEntity;

  @OneToMany(() => IdentEntity, ident => ident.account)
  idents = new Collection<IdentEntity>(this);

  @OneToMany(() => CertEntity, cert => cert.account)
  certs = new Collection<CertEntity>(this);
}