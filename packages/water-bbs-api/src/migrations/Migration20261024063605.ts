import { Migration } from '@mikro-orm/migrations';

export class Migration20261024063605 extends Migration {

  override name = 'Migration20261024063605';

  override up(): void | Promise<void> {
    this.addSql(`create table \`storage_entity\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`key\` text not null, \`mimetype\` text not null, \`size\` integer not null, \`hash\` text not null);`);
    this.addSql(`create index \`storage_entity_created_at_index\` on \`storage_entity\` (\`created_at\`);`);
    this.addSql(`create index \`storage_entity_removed_at_index\` on \`storage_entity\` (\`removed_at\`);`);
    this.addSql(`create index \`storage_entity_updated_at_index\` on \`storage_entity\` (\`updated_at\`);`);
    this.addSql(`create index \`storage_entity_key_index\` on \`storage_entity\` (\`key\`);`);
    this.addSql(`create index \`storage_entity_hash_index\` on \`storage_entity\` (\`hash\`);`);

    this.addSql(`alter table \`profile\` add column \`avatar\` text null;`);

    this.addSql(`pragma foreign_keys = off;`);
    this.addSql(`create table \`user_task__temp_alter\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`account_id\` text not null, \`task_id\` text not null, \`snapshot\` json not null, \`status\` text check (\`status\` in ('Progress', 'Completed', 'Cancelled')) not null);`);
    this.addSql(`insert into \`user_task__temp_alter\` select \`id\`, \`created_at\`, \`removed_at\`, \`updated_at\`, \`account_id\`, \`task_id\`, \`snapshot\`, \`status\` from \`user_task\`;`);
    this.addSql(`drop table \`user_task\`;`);
    this.addSql(`alter table \`user_task__temp_alter\` rename to \`user_task\`;`);
    this.addSql(`create index \`user_task_created_at_index\` on \`user_task\` (\`created_at\`);`);
    this.addSql(`create index \`user_task_removed_at_index\` on \`user_task\` (\`removed_at\`);`);
    this.addSql(`create index \`user_task_updated_at_index\` on \`user_task\` (\`updated_at\`);`);
    this.addSql(`create index \`user_task_account_id_index\` on \`user_task\` (\`account_id\`);`);
    this.addSql(`create index \`user_task_task_id_index\` on \`user_task\` (\`task_id\`);`);
    this.addSql(`pragma foreign_keys = on;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists \`storage_entity\`;`);

    this.addSql(`alter table \`profile\` drop column \`avatar\`;`);

    this.addSql(`pragma foreign_keys = off;`);
    this.addSql(`create table \`user_task__temp_alter\` (\`account_id\` text not null, \`created_at\` datetime not null, \`id\` text not null primary key, \`removed_at\` datetime null, \`snapshot\` json not null, \`status\` integer not null, \`task_id\` text not null, \`updated_at\` datetime null);`);
    this.addSql(`insert into \`user_task__temp_alter\` select \`account_id\`, \`created_at\`, \`id\`, \`removed_at\`, \`snapshot\`, \`status\`, \`task_id\`, \`updated_at\` from \`user_task\`;`);
    this.addSql(`drop table \`user_task\`;`);
    this.addSql(`alter table \`user_task__temp_alter\` rename to \`user_task\`;`);
    this.addSql(`create index \`user_task_account_id_index\` on \`user_task\` (\`account_id\`);`);
    this.addSql(`create index \`user_task_created_at_index\` on \`user_task\` (\`created_at\`);`);
    this.addSql(`create index \`user_task_removed_at_index\` on \`user_task\` (\`removed_at\`);`);
    this.addSql(`create index \`user_task_task_id_index\` on \`user_task\` (\`task_id\`);`);
    this.addSql(`create index \`user_task_updated_at_index\` on \`user_task\` (\`updated_at\`);`);
    this.addSql(`pragma foreign_keys = on;`);
  }

}
