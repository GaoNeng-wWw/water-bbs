import { Migration } from '@mikro-orm/migrations';

export class Migration20260503140453 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table \`permission_entity\` (\`id\` varchar(36) not null, \`created_at\` varchar(255) not null, \`updated_at\` varchar(255) null, \`removed_at\` varchar(255) null, \`code\` char(255) not null, \`name\` char(255) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`permission_entity\` add index \`permission_entity_created_at_index\` (\`created_at\`);`);
    this.addSql(`alter table \`permission_entity\` add index \`permission_entity_removed_at_index\` (\`removed_at\`);`);
    this.addSql(`alter table \`permission_entity\` add index \`permission_entity_code_index\` (\`code\`);`);
    this.addSql(`alter table \`permission_entity\` add index \`permission_entity_name_index\` (\`name\`);`);

    this.addSql(`create table \`role_entity\` (\`id\` varchar(36) not null, \`created_at\` varchar(255) not null, \`updated_at\` varchar(255) null, \`removed_at\` varchar(255) null, \`code\` char(255) not null, \`name\` char(255) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`role_entity\` add index \`role_entity_created_at_index\` (\`created_at\`);`);
    this.addSql(`alter table \`role_entity\` add index \`role_entity_removed_at_index\` (\`removed_at\`);`);
    this.addSql(`alter table \`role_entity\` add index \`role_entity_code_index\` (\`code\`);`);
    this.addSql(`alter table \`role_entity\` add index \`role_entity_name_index\` (\`name\`);`);

    this.addSql(`create table \`role_permission\` (\`role_entity_id\` varchar(36) not null, \`permission_entity_id\` varchar(36) not null, primary key (\`role_entity_id\`, \`permission_entity_id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`role_permission\` add index \`role_permission_role_entity_id_index\` (\`role_entity_id\`);`);
    this.addSql(`alter table \`role_permission\` add index \`role_permission_permission_entity_id_index\` (\`permission_entity_id\`);`);

    this.addSql(`create table \`account_entity\` (\`id\` varchar(36) not null, \`created_at\` varchar(255) not null, \`updated_at\` varchar(255) null, \`removed_at\` varchar(255) null, \`role_id\` varchar(36) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`account_entity\` add index \`account_entity_created_at_index\` (\`created_at\`);`);
    this.addSql(`alter table \`account_entity\` add index \`account_entity_removed_at_index\` (\`removed_at\`);`);
    this.addSql(`alter table \`account_entity\` add index \`account_entity_role_id_index\` (\`role_id\`);`);

    this.addSql(`create table \`profile_entity\` (\`account_id\` varchar(36) not null, \`created_at\` varchar(255) not null, \`updated_at\` varchar(255) null, \`removed_at\` varchar(255) null, \`name\` text not null, \`bio\` text null, \`avatar\` text null, primary key (\`account_id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`profile_entity\` add index \`profile_entity_created_at_index\` (\`created_at\`);`);
    this.addSql(`alter table \`profile_entity\` add index \`profile_entity_removed_at_index\` (\`removed_at\`);`);

    this.addSql(`create table \`ident_entity\` (\`id\` varchar(36) not null, \`ident_type\` enum('Email') not null, \`ident_value\` char(255) not null, \`verified\` tinyint(1) not null default false, \`account_id\` varchar(36) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`ident_entity\` add index \`ident_entity_ident_value_index\` (\`ident_value\`);`);
    this.addSql(`alter table \`ident_entity\` add index \`ident_entity_account_id_index\` (\`account_id\`);`);
    this.addSql(`alter table \`ident_entity\` add unique \`ident_entity_ident_type_ident_value_account_id_unique\` (\`ident_type\`, \`ident_value\`, \`account_id\`);`);

    this.addSql(`create table \`cert_entity\` (\`id\` varchar(36) not null, \`cert_type\` enum('Password') not null, \`cert_value\` char(255) not null, \`account_id\` varchar(36) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`cert_entity\` add index \`cert_entity_cert_value_index\` (\`cert_value\`);`);
    this.addSql(`alter table \`cert_entity\` add index \`cert_entity_account_id_index\` (\`account_id\`);`);

    this.addSql(`alter table \`role_permission\` add constraint \`role_permission_role_entity_id_foreign\` foreign key (\`role_entity_id\`) references \`role_entity\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`role_permission\` add constraint \`role_permission_permission_entity_id_foreign\` foreign key (\`permission_entity_id\`) references \`permission_entity\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`account_entity\` add constraint \`account_entity_role_id_foreign\` foreign key (\`role_id\`) references \`role_entity\` (\`id\`);`);

    this.addSql(`alter table \`profile_entity\` add constraint \`profile_entity_account_id_foreign\` foreign key (\`account_id\`) references \`account_entity\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`ident_entity\` add constraint \`ident_entity_account_id_foreign\` foreign key (\`account_id\`) references \`account_entity\` (\`id\`);`);

    this.addSql(`alter table \`cert_entity\` add constraint \`cert_entity_account_id_foreign\` foreign key (\`account_id\`) references \`account_entity\` (\`id\`);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table \`role_permission\` drop foreign key \`role_permission_permission_entity_id_foreign\`;`);
    this.addSql(`alter table \`role_permission\` drop foreign key \`role_permission_role_entity_id_foreign\`;`);
    this.addSql(`alter table \`account_entity\` drop foreign key \`account_entity_role_id_foreign\`;`);
    this.addSql(`alter table \`profile_entity\` drop foreign key \`profile_entity_account_id_foreign\`;`);
    this.addSql(`alter table \`ident_entity\` drop foreign key \`ident_entity_account_id_foreign\`;`);
    this.addSql(`alter table \`cert_entity\` drop foreign key \`cert_entity_account_id_foreign\`;`);

    this.addSql(`drop table if exists \`permission_entity\`;`);
    this.addSql(`drop table if exists \`role_entity\`;`);
    this.addSql(`drop table if exists \`role_permission\`;`);
    this.addSql(`drop table if exists \`account_entity\`;`);
    this.addSql(`drop table if exists \`profile_entity\`;`);
    this.addSql(`drop table if exists \`ident_entity\`;`);
    this.addSql(`drop table if exists \`cert_entity\`;`);
  }

}
