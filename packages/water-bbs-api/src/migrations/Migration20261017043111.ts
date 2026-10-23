import { Migration } from '@mikro-orm/migrations';

export class Migration20261017043111 extends Migration {

  override name = 'Migration20261017043111';

  override up(): void | Promise<void> {
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

    this.addSql(`create table \`governance_member\` (\`id\` text not null primary key, \`account_id\` text not null, \`kind\` text check (\`kind\` in ('admin', 'bd')) not null, \`started_at\` datetime not null, \`ended_at\` datetime null, \`reason\` text null, \`grant_type\` text check (\`grant_type\` in ('election', 'succession', 'migration')) not null);`);
    this.addSql(`create index \`governance_member_account_id_kind_index\` on \`governance_member\` (\`account_id\`, \`kind\`);`);

    this.addSql(`create table \`proposal\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`status\` text check (\`status\` in ('pending', 'controversy', 'approved', 'rejected', 'executing', 'executed', 'failed', 'cancelled', 'emergency-review')) not null default 'pending', \`title\` text not null, \`steps\` json not null, \`kind\` text check (\`kind\` in ('normal', 'emergency')) not null default 'normal', \`content\` text not null, \`start_at\` datetime not null, \`expired_at\` datetime not null, \`creator\` text not null, \`fail_reason\` text null);`);
    this.addSql(`create index \`proposal_created_at_index\` on \`proposal\` (\`created_at\`);`);
    this.addSql(`create index \`proposal_removed_at_index\` on \`proposal\` (\`removed_at\`);`);
    this.addSql(`create index \`proposal_updated_at_index\` on \`proposal\` (\`updated_at\`);`);

    this.addSql(`create table \`proposal_slot\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`proposal_id\` text not null, \`slot_id\` integer not null, \`agree_count\` integer not null default 0, \`disagree_count\` integer not null default 0);`);
    this.addSql(`create index \`proposal_slot_created_at_index\` on \`proposal_slot\` (\`created_at\`);`);
    this.addSql(`create index \`proposal_slot_removed_at_index\` on \`proposal_slot\` (\`removed_at\`);`);
    this.addSql(`create index \`proposal_slot_updated_at_index\` on \`proposal_slot\` (\`updated_at\`);`);
    this.addSql(`create unique index \`proposal_slot_proposal_id_slot_id_unique\` on \`proposal_slot\` (\`proposal_id\`, \`slot_id\`);`);

    this.addSql(`create table \`task_definition\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`name\` text not null, \`desc\` text not null, \`icon\` text null, \`condition\` json not null, \`reward\` json not null, \`schedule\` json not null, \`claim\` json null);`);
    this.addSql(`create index \`task_definition_created_at_index\` on \`task_definition\` (\`created_at\`);`);
    this.addSql(`create index \`task_definition_removed_at_index\` on \`task_definition\` (\`removed_at\`);`);
    this.addSql(`create index \`task_definition_updated_at_index\` on \`task_definition\` (\`updated_at\`);`);

    this.addSql(`create table \`user_task\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`account_id\` text not null, \`task_id\` text not null, \`snapshot\` json not null, \`status\` integer not null);`);
    this.addSql(`create index \`user_task_created_at_index\` on \`user_task\` (\`created_at\`);`);
    this.addSql(`create index \`user_task_removed_at_index\` on \`user_task\` (\`removed_at\`);`);
    this.addSql(`create index \`user_task_updated_at_index\` on \`user_task\` (\`updated_at\`);`);
    this.addSql(`create index \`user_task_account_id_index\` on \`user_task\` (\`account_id\`);`);
    this.addSql(`create index \`user_task_task_id_index\` on \`user_task\` (\`task_id\`);`);

    this.addSql(`create table \`user_task_progress\` (\`id\` text not null primary key, \`condition_id\` text not null, \`user_id\` text not null, \`task_id\` text not null, \`goal\` json not null, \`operator\` text not null, \`current\` json not null);`);

    this.addSql(`create table \`vote\` (\`id\` text not null primary key, \`kind\` integer not null, \`account_id\` text not null, \`proposal_id\` text not null, \`slot_id\` integer not null);`);
    this.addSql(`create unique index \`vote_proposal_id_account_id_unique\` on \`vote\` (\`proposal_id\`, \`account_id\`);`);

    this.addSql(`drop table if exists \`trigger\`;`);
    this.addSql(`drop table if exists \`workflow\`;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`create table \`trigger\` (\`condition\` json null, \`created_at\` datetime not null, \`cron\` text null, \`id\` text not null primary key, \`kind\` integer not null, \`name\` text not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`workflow_id\` text not null);`);
    this.addSql(`create index \`trigger_created_at_index\` on \`trigger\` (\`created_at\`);`);
    this.addSql(`create index \`trigger_removed_at_index\` on \`trigger\` (\`removed_at\`);`);
    this.addSql(`create index \`trigger_updated_at_index\` on \`trigger\` (\`updated_at\`);`);

    this.addSql(`create table \`workflow\` (\`created_at\` datetime not null, \`id\` text not null primary key, \`name\` text not null, \`removed_at\` datetime null, \`steps\` json not null, \`trigger_id\` text not null, \`updated_at\` datetime null);`);
    this.addSql(`create index \`workflow_created_at_index\` on \`workflow\` (\`created_at\`);`);
    this.addSql(`create index \`workflow_removed_at_index\` on \`workflow\` (\`removed_at\`);`);
    this.addSql(`create index \`workflow_updated_at_index\` on \`workflow\` (\`updated_at\`);`);

    this.addSql(`drop table if exists \`comment\`;`);
    this.addSql(`drop table if exists \`comment_reply\`;`);
    this.addSql(`drop table if exists \`governance_member\`;`);
    this.addSql(`drop table if exists \`proposal\`;`);
    this.addSql(`drop table if exists \`proposal_slot\`;`);
    this.addSql(`drop table if exists \`task_definition\`;`);
    this.addSql(`drop table if exists \`user_task\`;`);
    this.addSql(`drop table if exists \`user_task_progress\`;`);
    this.addSql(`drop table if exists \`vote\`;`);
  }

}
