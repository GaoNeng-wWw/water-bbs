import { Migration } from '@mikro-orm/migrations';

export class Migration20260820141703 extends Migration {

  override name = 'Migration20260820141703';

  override up(): void | Promise<void> {
    this.addSql(`create table \`account\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null);`);
    this.addSql(`create index \`account_created_at_index\` on \`account\` (\`created_at\`);`);
    this.addSql(`create index \`account_removed_at_index\` on \`account\` (\`removed_at\`);`);
    this.addSql(`create index \`account_updated_at_index\` on \`account\` (\`updated_at\`);`);

    this.addSql(`create table \`category\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`icon\` text null, \`name\` text not null, \`color\` text null, \`pined\` text not null default false);`);
    this.addSql(`create index \`category_created_at_index\` on \`category\` (\`created_at\`);`);
    this.addSql(`create index \`category_removed_at_index\` on \`category\` (\`removed_at\`);`);
    this.addSql(`create index \`category_updated_at_index\` on \`category\` (\`updated_at\`);`);

    this.addSql(`create table \`credential\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`credential_type\` text not null, \`credential_value\` text not null, \`salt\` text not null, \`account_id\` text not null, constraint \`credential_account_id_foreign\` foreign key (\`account_id\`) references \`account\` (\`id\`));`);
    this.addSql(`create index \`credential_created_at_index\` on \`credential\` (\`created_at\`);`);
    this.addSql(`create index \`credential_removed_at_index\` on \`credential\` (\`removed_at\`);`);
    this.addSql(`create index \`credential_updated_at_index\` on \`credential\` (\`updated_at\`);`);
    this.addSql(`create index \`credential_account_id_index\` on \`credential\` (\`account_id\`);`);

    this.addSql(`create table \`identifier\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`ident_type\` text not null, \`ident_value\` text not null, \`verified\` integer not null default false, \`account_id\` text not null, constraint \`identifier_account_id_foreign\` foreign key (\`account_id\`) references \`account\` (\`id\`));`);
    this.addSql(`create index \`identifier_created_at_index\` on \`identifier\` (\`created_at\`);`);
    this.addSql(`create index \`identifier_removed_at_index\` on \`identifier\` (\`removed_at\`);`);
    this.addSql(`create index \`identifier_updated_at_index\` on \`identifier\` (\`updated_at\`);`);
    this.addSql(`create index \`identifier_account_id_index\` on \`identifier\` (\`account_id\`);`);

    this.addSql(`create table \`profile\` (\`account_id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`nick\` text not null, \`bio\` text null);`);
    this.addSql(`create index \`profile_created_at_index\` on \`profile\` (\`created_at\`);`);
    this.addSql(`create index \`profile_removed_at_index\` on \`profile\` (\`removed_at\`);`);
    this.addSql(`create index \`profile_updated_at_index\` on \`profile\` (\`updated_at\`);`);

    this.addSql(`create table \`reply\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`topic_id\` text not null, \`content\` text not null, \`author_id\` text not null, \`hidden_start\` date null, \`hidden_end\` date null, \`hidden_reason\` text null);`);
    this.addSql(`create index \`reply_created_at_index\` on \`reply\` (\`created_at\`);`);
    this.addSql(`create index \`reply_removed_at_index\` on \`reply\` (\`removed_at\`);`);
    this.addSql(`create index \`reply_updated_at_index\` on \`reply\` (\`updated_at\`);`);

    this.addSql(`create table \`topic\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`title\` text not null, \`author_id\` text not null, \`category_id\` text not null, \`pinned\` integer not null default false, \`hidden_start\` date null, \`hidden_end\` date null, \`hidden_reason\` text null);`);
    this.addSql(`create index \`topic_created_at_index\` on \`topic\` (\`created_at\`);`);
    this.addSql(`create index \`topic_removed_at_index\` on \`topic\` (\`removed_at\`);`);
    this.addSql(`create index \`topic_updated_at_index\` on \`topic\` (\`updated_at\`);`);
    this.addSql(`create index \`topic_author_id_index\` on \`topic\` (\`author_id\`);`);

    this.addSql(`create table \`transaction\` (\`id\` text not null primary key, \`from\` text not null, \`to\` text not null, \`amount\` bigint not null, \`status\` text check (\`status\` in ('success', 'pending', 'fail')) not null, \`detail\` text not null);`);
    this.addSql(`create index \`transaction_from_index\` on \`transaction\` (\`from\`);`);
    this.addSql(`create index \`transaction_to_index\` on \`transaction\` (\`to\`);`);
    this.addSql(`create index \`transaction_status_index\` on \`transaction\` (\`status\`);`);

    this.addSql(`create table \`trigger\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`name\` text not null, \`workflow_id\` text not null, \`kind\` integer not null, \`condition\` json null, \`cron\` text null);`);
    this.addSql(`create index \`trigger_created_at_index\` on \`trigger\` (\`created_at\`);`);
    this.addSql(`create index \`trigger_removed_at_index\` on \`trigger\` (\`removed_at\`);`);
    this.addSql(`create index \`trigger_updated_at_index\` on \`trigger\` (\`updated_at\`);`);

    this.addSql(`create table \`wallet\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`balance_snapshot\` bigint not null);`);
    this.addSql(`create index \`wallet_created_at_index\` on \`wallet\` (\`created_at\`);`);
    this.addSql(`create index \`wallet_removed_at_index\` on \`wallet\` (\`removed_at\`);`);
    this.addSql(`create index \`wallet_updated_at_index\` on \`wallet\` (\`updated_at\`);`);

    this.addSql(`create table \`workflow\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`name\` text not null, \`trigger_id\` text not null, \`steps\` json not null);`);
    this.addSql(`create index \`workflow_created_at_index\` on \`workflow\` (\`created_at\`);`);
    this.addSql(`create index \`workflow_removed_at_index\` on \`workflow\` (\`removed_at\`);`);
    this.addSql(`create index \`workflow_updated_at_index\` on \`workflow\` (\`updated_at\`);`);
  }

  override down(): void | Promise<void> {

    this.addSql(`drop table if exists \`account\`;`);
    this.addSql(`drop table if exists \`category\`;`);
    this.addSql(`drop table if exists \`credential\`;`);
    this.addSql(`drop table if exists \`identifier\`;`);
    this.addSql(`drop table if exists \`profile\`;`);
    this.addSql(`drop table if exists \`reply\`;`);
    this.addSql(`drop table if exists \`topic\`;`);
    this.addSql(`drop table if exists \`transaction\`;`);
    this.addSql(`drop table if exists \`trigger\`;`);
    this.addSql(`drop table if exists \`wallet\`;`);
    this.addSql(`drop table if exists \`workflow\`;`);
  }

}
