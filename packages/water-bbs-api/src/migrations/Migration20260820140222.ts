import { Migration } from '@mikro-orm/migrations';

export class Migration20260820140222 extends Migration {

  override name = 'Migration20260820140222';

  override up(): void | Promise<void> {
    this.addSql(`create table \`trigger_entity\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`name\` text not null, \`workflow_id\` text not null, \`kind\` integer not null, \`condition\` json null, \`cron\` text null);`);
    this.addSql(`create index \`trigger_entity_created_at_index\` on \`trigger_entity\` (\`created_at\`);`);
    this.addSql(`create index \`trigger_entity_removed_at_index\` on \`trigger_entity\` (\`removed_at\`);`);
    this.addSql(`create index \`trigger_entity_updated_at_index\` on \`trigger_entity\` (\`updated_at\`);`);

    this.addSql(`create table \`workflow_entity\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`name\` text not null, \`trigger_id\` text not null, \`steps\` json not null);`);
    this.addSql(`create index \`workflow_entity_created_at_index\` on \`workflow_entity\` (\`created_at\`);`);
    this.addSql(`create index \`workflow_entity_removed_at_index\` on \`workflow_entity\` (\`removed_at\`);`);
    this.addSql(`create index \`workflow_entity_updated_at_index\` on \`workflow_entity\` (\`updated_at\`);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists \`trigger_entity\`;`);
    this.addSql(`drop table if exists \`workflow_entity\`;`);
  }

}
