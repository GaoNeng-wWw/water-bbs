import { Migration } from '@mikro-orm/migrations';

export class Migration20260823062735 extends Migration {

  override name = 'Migration20260823062735';

  override up(): void | Promise<void> {
    this.addSql(`create table \`governance_member\` (\`id\` text not null primary key, \`account_id\` text not null, \`kind\` text check (\`kind\` in ('admin', 'bd')) not null, \`started_at\` datetime not null, \`ended_at\` datetime null, \`reason\` text null, \`grant_type\` text check (\`grant_type\` in ('election', 'succession', 'migration')) not null);`);
    this.addSql(`create index \`governance_member_account_id_kind_index\` on \`governance_member\` (\`account_id\`, \`kind\`);`);

    this.addSql(`create table \`proposal\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`status\` text check (\`status\` in ('pending', 'controversy', 'approved', 'rejected', 'executing', 'executed', 'failed', 'cancelled')) not null default 'pending', \`title\` text not null, \`steps\` json not null, \`kind\` text check (\`kind\` in ('normal', 'emergency')) not null default 'normal', \`start_at\` datetime not null, \`expired_at\` datetime not null, \`creator\` text not null, \`fail_reason\` text not null);`);
    this.addSql(`create index \`proposal_created_at_index\` on \`proposal\` (\`created_at\`);`);
    this.addSql(`create index \`proposal_removed_at_index\` on \`proposal\` (\`removed_at\`);`);
    this.addSql(`create index \`proposal_updated_at_index\` on \`proposal\` (\`updated_at\`);`);

    this.addSql(`create table \`proposal_slot\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`proposal_id\` text not null, \`slot_id\` integer not null, \`agree_count\` integer not null default 0, \`disagree_count\` integer not null default 0);`);
    this.addSql(`create index \`proposal_slot_created_at_index\` on \`proposal_slot\` (\`created_at\`);`);
    this.addSql(`create index \`proposal_slot_removed_at_index\` on \`proposal_slot\` (\`removed_at\`);`);
    this.addSql(`create index \`proposal_slot_updated_at_index\` on \`proposal_slot\` (\`updated_at\`);`);
    this.addSql(`create unique index \`proposal_slot_proposal_id_slot_id_unique\` on \`proposal_slot\` (\`proposal_id\`, \`slot_id\`);`);

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

    this.addSql(`drop table if exists \`governance_member\`;`);
    this.addSql(`drop table if exists \`proposal\`;`);
    this.addSql(`drop table if exists \`proposal_slot\`;`);
    this.addSql(`drop table if exists \`vote\`;`);
  }

}
