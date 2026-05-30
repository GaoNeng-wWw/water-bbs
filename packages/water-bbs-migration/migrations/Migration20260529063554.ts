import { Migration } from '@mikro-orm/migrations';

export class Migration20260529063554 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table \`category\` (\`id\` varchar(36) not null, \`created_at\` datetime not null default current_timestamp, \`updated_at\` datetime null, \`removed_at\` datetime null, \`name\` char(255) not null, \`parent_id\` varchar(36) null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`category\` add index \`category_created_at_index\` (\`created_at\`);`);
    this.addSql(`alter table \`category\` add index \`category_removed_at_index\` (\`removed_at\`);`);

    this.addSql(`create table \`permission\` (\`id\` varchar(36) not null, \`created_at\` datetime not null default current_timestamp, \`updated_at\` datetime null, \`removed_at\` datetime null, \`code\` char(255) not null, \`name\` char(255) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`permission\` add index \`permission_created_at_index\` (\`created_at\`);`);
    this.addSql(`alter table \`permission\` add index \`permission_removed_at_index\` (\`removed_at\`);`);
    this.addSql(`alter table \`permission\` add index \`permission_code_index\` (\`code\`);`);
    this.addSql(`alter table \`permission\` add index \`permission_name_index\` (\`name\`);`);

    this.addSql(`create table \`post\` (\`id\` varchar(36) not null, \`created_at\` datetime not null default current_timestamp, \`updated_at\` datetime null, \`removed_at\` datetime null, \`title\` text not null, \`author_id\` varchar(36) not null, \`category_id\` varchar(36) not null, \`version\` varchar(36) not null, \`last_floor\` int not null default 1, \`hidden\` tinyint(1) not null default false, \`hidden_reason\` varchar(255) null, \`hide_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`post\` add index \`post_created_at_index\` (\`created_at\`);`);
    this.addSql(`alter table \`post\` add index \`post_removed_at_index\` (\`removed_at\`);`);

    this.addSql(`create table \`proposals\` (\`id\` varchar(36) not null default '019e7272-5013-70ff-8529-ba8934dc735d', \`created_at\` datetime not null default current_timestamp, \`updated_at\` datetime null, \`removed_at\` datetime null, \`author_id\` varchar(36) not null, \`command\` text not null, \`start_at\` datetime not null, \`end_at\` datetime not null, \`status\` enum('active','passed','rejected','executed','cancelled') not null default 'active', \`approval_percent\` numeric(5,2) not null default 50, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`proposals\` add index \`proposals_created_at_index\` (\`created_at\`);`);
    this.addSql(`alter table \`proposals\` add index \`proposals_removed_at_index\` (\`removed_at\`);`);
    this.addSql(`alter table \`proposals\` add index \`proposals_author_id_index\` (\`author_id\`);`);

    this.addSql(`create table \`role\` (\`id\` varchar(36) not null, \`created_at\` datetime not null default current_timestamp, \`updated_at\` datetime null, \`removed_at\` datetime null, \`code\` char(255) not null, \`name\` char(255) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`role\` add index \`role_created_at_index\` (\`created_at\`);`);
    this.addSql(`alter table \`role\` add index \`role_removed_at_index\` (\`removed_at\`);`);
    this.addSql(`alter table \`role\` add index \`role_code_index\` (\`code\`);`);
    this.addSql(`alter table \`role\` add index \`role_name_index\` (\`name\`);`);

    this.addSql(`create table \`account\` (\`id\` varchar(36) not null, \`created_at\` datetime not null default current_timestamp, \`updated_at\` datetime null, \`removed_at\` datetime null, \`role_id\` varchar(36) null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`account\` add index \`account_created_at_index\` (\`created_at\`);`);
    this.addSql(`alter table \`account\` add index \`account_removed_at_index\` (\`removed_at\`);`);
    this.addSql(`alter table \`account\` add index \`account_role_id_index\` (\`role_id\`);`);

    this.addSql(`create table \`profile\` (\`account_id\` varchar(36) not null, \`created_at\` datetime not null default current_timestamp, \`updated_at\` datetime null, \`removed_at\` datetime null, \`name\` text not null, \`bio\` text null, \`avatar_storage_key\` varchar(255) null, \`avatar_name\` text null, \`avatar_size\` int null, \`avatar_mime_type\` varchar(255) null, \`avatar_storage_type\` varchar(255) null, primary key (\`account_id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`profile\` add index \`profile_created_at_index\` (\`created_at\`);`);
    this.addSql(`alter table \`profile\` add index \`profile_removed_at_index\` (\`removed_at\`);`);
    this.addSql(`alter table \`profile\` add index \`profile_avatar_storage_key_index\` (\`avatar_storage_key\`);`);

    this.addSql(`create table \`ident\` (\`id\` varchar(36) not null, \`ident_type\` enum('Email') not null, \`ident_value\` char(255) not null, \`verified\` tinyint(1) not null default false, \`account_id\` varchar(36) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`ident\` add index \`ident_ident_value_index\` (\`ident_value\`);`);
    this.addSql(`alter table \`ident\` add index \`ident_account_id_index\` (\`account_id\`);`);
    this.addSql(`alter table \`ident\` add unique \`ident_ident_type_ident_value_account_id_unique\` (\`ident_type\`, \`ident_value\`, \`account_id\`);`);

    this.addSql(`create table \`cert\` (\`id\` varchar(36) not null, \`cert_type\` enum('Password') not null, \`cert_value\` char(255) not null, \`account_id\` varchar(36) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`cert\` add index \`cert_cert_value_index\` (\`cert_value\`);`);
    this.addSql(`alter table \`cert\` add index \`cert_account_id_index\` (\`account_id\`);`);

    this.addSql(`create table \`role_permission\` (\`role_id\` varchar(36) not null, \`permission_id\` varchar(36) not null, primary key (\`role_id\`, \`permission_id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`role_permission\` add index \`role_permission_role_id_index\` (\`role_id\`);`);
    this.addSql(`alter table \`role_permission\` add index \`role_permission_permission_id_index\` (\`permission_id\`);`);

    this.addSql(`create table \`thread\` (\`id\` varchar(36) not null, \`created_at\` datetime not null default current_timestamp, \`updated_at\` datetime null, \`removed_at\` datetime null, \`content\` text not null, \`author_id\` varchar(36) not null, \`parent_id\` varchar(36) not null, \`floor\` int not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`thread\` add index \`thread_created_at_index\` (\`created_at\`);`);
    this.addSql(`alter table \`thread\` add index \`thread_removed_at_index\` (\`removed_at\`);`);
    this.addSql(`alter table \`thread\` add index \`thread_parent_id_index\` (\`parent_id\`);`);

    this.addSql(`create table \`reply\` (\`id\` varchar(36) not null, \`created_at\` datetime not null default current_timestamp, \`updated_at\` datetime null, \`removed_at\` datetime null, \`content\` text not null, \`author_id\` varchar(36) not null, \`thread_id\` varchar(36) not null, \`parent_id\` varchar(36) null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`reply\` add index \`reply_created_at_index\` (\`created_at\`);`);
    this.addSql(`alter table \`reply\` add index \`reply_removed_at_index\` (\`removed_at\`);`);
    this.addSql(`alter table \`reply\` add index \`reply_thread_id_index\` (\`thread_id\`);`);
    this.addSql(`alter table \`reply\` add index \`reply_parent_id_index\` (\`parent_id\`);`);

    this.addSql(`create table \`vote\` (\`id\` varchar(36) not null default '019e7272-5014-7110-9303-119f5cc266ed', \`created_at\` datetime not null default current_timestamp, \`updated_at\` datetime null, \`removed_at\` datetime null, \`proposal_id\` varchar(36) not null, \`account_id\` varchar(36) not null, \`action\` enum('yes','no') not null, \`comment\` text not null default (''), primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`vote\` add index \`vote_created_at_index\` (\`created_at\`);`);
    this.addSql(`alter table \`vote\` add index \`vote_removed_at_index\` (\`removed_at\`);`);
    this.addSql(`alter table \`vote\` add index \`vote_proposal_id_index\` (\`proposal_id\`);`);
    this.addSql(`alter table \`vote\` add index \`vote_account_id_index\` (\`account_id\`);`);
    this.addSql(`alter table \`vote\` add unique \`vote_proposal_id_account_id_unique\` (\`proposal_id\`, \`account_id\`);`);

    this.addSql(`alter table \`account\` add constraint \`account_role_id_foreign\` foreign key (\`role_id\`) references \`role\` (\`id\`) on delete set null;`);

    this.addSql(`alter table \`profile\` add constraint \`profile_account_id_foreign\` foreign key (\`account_id\`) references \`account\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`ident\` add constraint \`ident_account_id_foreign\` foreign key (\`account_id\`) references \`account\` (\`id\`);`);

    this.addSql(`alter table \`cert\` add constraint \`cert_account_id_foreign\` foreign key (\`account_id\`) references \`account\` (\`id\`);`);

    this.addSql(`alter table \`role_permission\` add constraint \`role_permission_role_id_foreign\` foreign key (\`role_id\`) references \`role\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`role_permission\` add constraint \`role_permission_permission_id_foreign\` foreign key (\`permission_id\`) references \`permission\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`thread\` add constraint \`thread_parent_id_foreign\` foreign key (\`parent_id\`) references \`post\` (\`id\`);`);

    this.addSql(`alter table \`reply\` add constraint \`reply_thread_id_foreign\` foreign key (\`thread_id\`) references \`thread\` (\`id\`);`);
    this.addSql(`alter table \`reply\` add constraint \`reply_parent_id_foreign\` foreign key (\`parent_id\`) references \`reply\` (\`id\`) on delete set null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table \`role_permission\` drop foreign key \`role_permission_permission_id_foreign\`;`);
    this.addSql(`alter table \`thread\` drop foreign key \`thread_parent_id_foreign\`;`);
    this.addSql(`alter table \`account\` drop foreign key \`account_role_id_foreign\`;`);
    this.addSql(`alter table \`role_permission\` drop foreign key \`role_permission_role_id_foreign\`;`);
    this.addSql(`alter table \`profile\` drop foreign key \`profile_account_id_foreign\`;`);
    this.addSql(`alter table \`ident\` drop foreign key \`ident_account_id_foreign\`;`);
    this.addSql(`alter table \`cert\` drop foreign key \`cert_account_id_foreign\`;`);
    this.addSql(`alter table \`reply\` drop foreign key \`reply_thread_id_foreign\`;`);
    this.addSql(`alter table \`reply\` drop foreign key \`reply_parent_id_foreign\`;`);

    this.addSql(`drop table if exists \`category\`;`);
    this.addSql(`drop table if exists \`permission\`;`);
    this.addSql(`drop table if exists \`post\`;`);
    this.addSql(`drop table if exists \`proposals\`;`);
    this.addSql(`drop table if exists \`role\`;`);
    this.addSql(`drop table if exists \`account\`;`);
    this.addSql(`drop table if exists \`profile\`;`);
    this.addSql(`drop table if exists \`ident\`;`);
    this.addSql(`drop table if exists \`cert\`;`);
    this.addSql(`drop table if exists \`role_permission\`;`);
    this.addSql(`drop table if exists \`thread\`;`);
    this.addSql(`drop table if exists \`reply\`;`);
    this.addSql(`drop table if exists \`vote\`;`);
  }

}
