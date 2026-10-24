import { Migration } from '@mikro-orm/migrations';

export class Migration20261024124529 extends Migration {

  override name = 'Migration20261024124529';

  override up(): void | Promise<void> {
    this.addSql(`create table \`account\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null);`);
    this.addSql(`create index \`account_created_at_index\` on \`account\` (\`created_at\`);`);
    this.addSql(`create index \`account_removed_at_index\` on \`account\` (\`removed_at\`);`);
    this.addSql(`create index \`account_updated_at_index\` on \`account\` (\`updated_at\`);`);

    this.addSql(`create table \`category\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`icon\` text null, \`name\` text not null, \`color\` text null, \`pined\` text not null default false);`);
    this.addSql(`create index \`category_created_at_index\` on \`category\` (\`created_at\`);`);
    this.addSql(`create index \`category_removed_at_index\` on \`category\` (\`removed_at\`);`);
    this.addSql(`create index \`category_updated_at_index\` on \`category\` (\`updated_at\`);`);

    this.addSql(`create table \`comment\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`resource_id\` text not null, \`resource_kind\` text check (\`resource_kind\` in ('topic', 'topic_reply', 'proposal')) not null, \`locked_at\` datetime null, \`lock_reason\` text null);`);
    this.addSql(`create index \`comment_created_at_index\` on \`comment\` (\`created_at\`);`);
    this.addSql(`create index \`comment_removed_at_index\` on \`comment\` (\`removed_at\`);`);
    this.addSql(`create index \`comment_updated_at_index\` on \`comment\` (\`updated_at\`);`);
    this.addSql(`create index \`comment_resource_kind_resource_id_removed_at_index\` on \`comment\` (\`resource_kind\`, \`resource_id\`, \`removed_at\`);`);
    this.addSql(`create index \`comment_resource_kind_resource_id_removed_at_created_at_index\` on \`comment\` (\`resource_kind\`, \`resource_id\`, \`removed_at\`, \`created_at\`);`);

    this.addSql(`create table \`comment_reply\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`content\` text not null, \`comment_id\` text not null, \`creator\` text not null, \`parent_id\` text null, \`path\` text not null, \`meta\` json null, \`hidden_period_start\` date null, \`hidden_period_end\` date null, \`hidden_period_reason\` text null);`);
    this.addSql(`create index \`comment_reply_created_at_index\` on \`comment_reply\` (\`created_at\`);`);
    this.addSql(`create index \`comment_reply_removed_at_index\` on \`comment_reply\` (\`removed_at\`);`);
    this.addSql(`create index \`comment_reply_updated_at_index\` on \`comment_reply\` (\`updated_at\`);`);
    this.addSql(`create index \`comment_reply_comment_id_parent_id_removed_at_index\` on \`comment_reply\` (\`comment_id\`, \`parent_id\`, \`removed_at\`);`);
    this.addSql(`create index \`comment_reply_comment_id_removed_at_path_index\` on \`comment_reply\` (\`comment_id\`, \`removed_at\`, \`path\`);`);

    this.addSql(`create table \`credential\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`credential_type\` text not null, \`credential_value\` text not null, \`salt\` text not null, \`account_id\` text not null, constraint \`credential_account_id_foreign\` foreign key (\`account_id\`) references \`account\` (\`id\`));`);
    this.addSql(`create index \`credential_created_at_index\` on \`credential\` (\`created_at\`);`);
    this.addSql(`create index \`credential_removed_at_index\` on \`credential\` (\`removed_at\`);`);
    this.addSql(`create index \`credential_updated_at_index\` on \`credential\` (\`updated_at\`);`);
    this.addSql(`create index \`credential_account_id_index\` on \`credential\` (\`account_id\`);`);

    this.addSql(`create table \`governance_member\` (\`id\` text not null primary key, \`account_id\` text not null, \`kind\` text check (\`kind\` in ('admin', 'bd')) not null, \`started_at\` datetime not null, \`ended_at\` datetime null, \`reason\` text null, \`grant_type\` text check (\`grant_type\` in ('election', 'succession', 'migration')) not null);`);
    this.addSql(`create index \`governance_member_account_id_kind_index\` on \`governance_member\` (\`account_id\`, \`kind\`);`);

    this.addSql(`create table \`identifier\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`ident_type\` text not null, \`ident_value\` text not null, \`verified\` integer not null default false, \`account_id\` text not null, constraint \`identifier_account_id_foreign\` foreign key (\`account_id\`) references \`account\` (\`id\`));`);
    this.addSql(`create index \`identifier_created_at_index\` on \`identifier\` (\`created_at\`);`);
    this.addSql(`create index \`identifier_removed_at_index\` on \`identifier\` (\`removed_at\`);`);
    this.addSql(`create index \`identifier_updated_at_index\` on \`identifier\` (\`updated_at\`);`);
    this.addSql(`create index \`identifier_account_id_index\` on \`identifier\` (\`account_id\`);`);

    this.addSql(`create table \`profile\` (\`account_id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`nick\` text not null, \`bio\` text null, \`avatar\` text null);`);
    this.addSql(`create index \`profile_created_at_index\` on \`profile\` (\`created_at\`);`);
    this.addSql(`create index \`profile_removed_at_index\` on \`profile\` (\`removed_at\`);`);
    this.addSql(`create index \`profile_updated_at_index\` on \`profile\` (\`updated_at\`);`);

    this.addSql(`create table \`proposal\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`status\` text check (\`status\` in ('pending', 'controversy', 'approved', 'rejected', 'executing', 'executed', 'failed', 'cancelled', 'emergency-review')) not null default 'pending', \`title\` text not null, \`steps\` json not null, \`kind\` text check (\`kind\` in ('normal', 'emergency')) not null default 'normal', \`content\` text not null, \`start_at\` datetime not null, \`expired_at\` datetime not null, \`creator\` text not null, \`fail_reason\` text null);`);
    this.addSql(`create index \`proposal_created_at_index\` on \`proposal\` (\`created_at\`);`);
    this.addSql(`create index \`proposal_removed_at_index\` on \`proposal\` (\`removed_at\`);`);
    this.addSql(`create index \`proposal_updated_at_index\` on \`proposal\` (\`updated_at\`);`);

    this.addSql(`create table \`proposal_slot\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`proposal_id\` text not null, \`slot_id\` integer not null, \`agree_count\` integer not null default 0, \`disagree_count\` integer not null default 0);`);
    this.addSql(`create index \`proposal_slot_created_at_index\` on \`proposal_slot\` (\`created_at\`);`);
    this.addSql(`create index \`proposal_slot_removed_at_index\` on \`proposal_slot\` (\`removed_at\`);`);
    this.addSql(`create index \`proposal_slot_updated_at_index\` on \`proposal_slot\` (\`updated_at\`);`);
    this.addSql(`create unique index \`proposal_slot_proposal_id_slot_id_unique\` on \`proposal_slot\` (\`proposal_id\`, \`slot_id\`);`);

    this.addSql(`create table \`reply\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`topic_id\` text not null, \`content\` text not null, \`author_id\` text not null, \`hidden_start\` date null, \`hidden_end\` date null, \`hidden_reason\` text null);`);
    this.addSql(`create index \`reply_created_at_index\` on \`reply\` (\`created_at\`);`);
    this.addSql(`create index \`reply_removed_at_index\` on \`reply\` (\`removed_at\`);`);
    this.addSql(`create index \`reply_updated_at_index\` on \`reply\` (\`updated_at\`);`);

    this.addSql(`create table \`storage_entity\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`key\` text not null, \`mimetype\` text not null, \`size\` integer not null, \`hash\` text not null, \`persistence\` integer not null default false);`);
    this.addSql(`create index \`storage_entity_created_at_index\` on \`storage_entity\` (\`created_at\`);`);
    this.addSql(`create index \`storage_entity_removed_at_index\` on \`storage_entity\` (\`removed_at\`);`);
    this.addSql(`create index \`storage_entity_updated_at_index\` on \`storage_entity\` (\`updated_at\`);`);
    this.addSql(`create index \`storage_entity_key_index\` on \`storage_entity\` (\`key\`);`);
    this.addSql(`create index \`storage_entity_hash_index\` on \`storage_entity\` (\`hash\`);`);

    this.addSql(`create table \`task_definition\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`name\` text not null, \`desc\` text not null, \`icon\` text null, \`condition\` json not null, \`reward\` json not null, \`schedule\` json not null, \`claim\` json null);`);
    this.addSql(`create index \`task_definition_created_at_index\` on \`task_definition\` (\`created_at\`);`);
    this.addSql(`create index \`task_definition_removed_at_index\` on \`task_definition\` (\`removed_at\`);`);
    this.addSql(`create index \`task_definition_updated_at_index\` on \`task_definition\` (\`updated_at\`);`);

    this.addSql(`create table \`topic\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`title\` text not null, \`author_id\` text not null, \`category_id\` text not null, \`pinned\` integer not null default false, \`hidden_start\` date null, \`hidden_end\` date null, \`hidden_reason\` text null);`);
    this.addSql(`create index \`topic_created_at_index\` on \`topic\` (\`created_at\`);`);
    this.addSql(`create index \`topic_removed_at_index\` on \`topic\` (\`removed_at\`);`);
    this.addSql(`create index \`topic_updated_at_index\` on \`topic\` (\`updated_at\`);`);
    this.addSql(`create index \`topic_author_id_index\` on \`topic\` (\`author_id\`);`);

    this.addSql(`create table \`transaction\` (\`id\` text not null primary key, \`from\` text not null, \`to\` text not null, \`amount\` bigint not null, \`status\` text check (\`status\` in ('success', 'pending', 'fail')) not null, \`detail\` text not null);`);
    this.addSql(`create index \`transaction_from_index\` on \`transaction\` (\`from\`);`);
    this.addSql(`create index \`transaction_to_index\` on \`transaction\` (\`to\`);`);
    this.addSql(`create index \`transaction_status_index\` on \`transaction\` (\`status\`);`);

    this.addSql(`create table \`user_task\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`account_id\` text not null, \`task_id\` text not null, \`snapshot\` json not null, \`status\` text check (\`status\` in ('Progress', 'Completed', 'Cancelled')) not null);`);
    this.addSql(`create index \`user_task_created_at_index\` on \`user_task\` (\`created_at\`);`);
    this.addSql(`create index \`user_task_removed_at_index\` on \`user_task\` (\`removed_at\`);`);
    this.addSql(`create index \`user_task_updated_at_index\` on \`user_task\` (\`updated_at\`);`);
    this.addSql(`create index \`user_task_account_id_index\` on \`user_task\` (\`account_id\`);`);
    this.addSql(`create index \`user_task_task_id_index\` on \`user_task\` (\`task_id\`);`);

    this.addSql(`create table \`user_task_progress\` (\`id\` text not null primary key, \`condition_id\` text not null, \`user_id\` text not null, \`task_id\` text not null, \`goal\` json not null, \`operator\` text not null, \`current\` json not null);`);

    this.addSql(`create table \`vote\` (\`id\` text not null primary key, \`kind\` integer not null, \`account_id\` text not null, \`proposal_id\` text not null, \`slot_id\` integer not null);`);
    this.addSql(`create unique index \`vote_proposal_id_account_id_unique\` on \`vote\` (\`proposal_id\`, \`account_id\`);`);

    this.addSql(`create table \`wallet\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`balance_snapshot\` bigint not null);`);
    this.addSql(`create index \`wallet_created_at_index\` on \`wallet\` (\`created_at\`);`);
    this.addSql(`create index \`wallet_removed_at_index\` on \`wallet\` (\`removed_at\`);`);
    this.addSql(`create index \`wallet_updated_at_index\` on \`wallet\` (\`updated_at\`);`);
  }

}
