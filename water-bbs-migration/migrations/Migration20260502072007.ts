import { Migration } from '@mikro-orm/migrations';

export class Migration20260502072007 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table \`cert\` (\`id\` varchar(36) not null, \`cert_type\` enum('Password') not null, \`cert_value\` char(255) not null, \`account_id\` varchar(36) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`cert\` add index \`cert_cert_value_index\` (\`cert_value\`);`);
    this.addSql(`alter table \`cert\` add index \`cert_account_id_index\` (\`account_id\`);`);

    this.addSql(`create table \`role_permission\` (\`role_id\` varchar(36) not null, \`permission_id\` varchar(36) not null, primary key (\`role_id\`, \`permission_id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`role_permission\` add index \`role_permission_role_id_index\` (\`role_id\`);`);
    this.addSql(`alter table \`role_permission\` add index \`role_permission_permission_id_index\` (\`permission_id\`);`);

    this.addSql(`alter table \`cert\` add constraint \`cert_account_id_foreign\` foreign key (\`account_id\`) references \`account\` (\`id\`);`);

    this.addSql(`alter table \`role_permission\` add constraint \`role_permission_role_id_foreign\` foreign key (\`role_id\`) references \`role\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`role_permission\` add constraint \`role_permission_permission_id_foreign\` foreign key (\`permission_id\`) references \`permission\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`permission\` modify \`code\` char(255) not null;`);
    this.addSql(`alter table \`permission\` modify \`name\` char(255) not null;`);
    this.addSql(`alter table \`permission\` add index \`permission_code_index\` (\`code\`);`);
    this.addSql(`alter table \`permission\` add index \`permission_name_index\` (\`name\`);`);

    this.addSql(`alter table \`role\` modify \`name\` char(255) not null;`);
    this.addSql(`alter table \`role\` add index \`role_name_index\` (\`name\`);`);

    this.addSql(`alter table \`account\` add constraint \`account_role_id_foreign\` foreign key (\`role_id\`) references \`role\` (\`id\`);`);

    this.addSql(`alter table \`profile\` add constraint \`profile_account_id_foreign\` foreign key (\`account_id\`) references \`account\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`ident\` modify \`ident_value\` char(255) not null;`);
    this.addSql(`alter table \`ident\` add constraint \`ident_account_id_foreign\` foreign key (\`account_id\`) references \`account\` (\`id\`);`);
    this.addSql(`alter table \`ident\` add index \`ident_ident_value_index\` (\`ident_value\`);`);
    this.addSql(`alter table \`ident\` add index \`ident_account_id_index\` (\`account_id\`);`);
    this.addSql(`alter table \`ident\` add unique \`ident_ident_type_ident_value_account_id_unique\` (\`ident_type\`, \`ident_value\`, \`account_id\`);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists \`cert\`;`);
    this.addSql(`drop table if exists \`role_permission\`;`);

    this.addSql(`alter table \`account\` drop foreign key \`account_role_id_foreign\`;`);

    this.addSql(`alter table \`ident\` drop foreign key \`ident_account_id_foreign\`;`);

    this.addSql(`alter table \`profile\` drop foreign key \`profile_account_id_foreign\`;`);

    this.addSql(`alter table \`ident\` drop index \`ident_ident_value_index\`;`);
    this.addSql(`alter table \`ident\` drop index \`ident_account_id_index\`;`);
    this.addSql(`alter table \`ident\` drop index \`ident_ident_type_ident_value_account_id_unique\`;`);
    this.addSql(`alter table \`ident\` modify \`ident_value\` text not null;`);

    this.addSql(`alter table \`permission\` drop index \`permission_code_index\`;`);
    this.addSql(`alter table \`permission\` drop index \`permission_name_index\`;`);
    this.addSql(`alter table \`permission\` modify \`code\` text not null;`);
    this.addSql(`alter table \`permission\` modify \`name\` text not null;`);

    this.addSql(`alter table \`role\` drop index \`role_name_index\`;`);
    this.addSql(`alter table \`role\` modify \`name\` text not null;`);
  }

}
