import { Migration } from '@mikro-orm/migrations';

export class Migration20260905024640 extends Migration {

  override name = 'Migration20260905024640';

  override up(): void | Promise<void> {
    this.addSql(`create table \`comment\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`resource_id\` text not null, \`resource_kind\` text check (\`resource_kind\` in ('topic', 'topic_reply')) not null);`);
    this.addSql(`create index \`comment_created_at_index\` on \`comment\` (\`created_at\`);`);
    this.addSql(`create index \`comment_removed_at_index\` on \`comment\` (\`removed_at\`);`);
    this.addSql(`create index \`comment_updated_at_index\` on \`comment\` (\`updated_at\`);`);
    this.addSql(`create index \`comment_resource_kind_resource_id_removed_at_index\` on \`comment\` (\`resource_kind\`, \`resource_id\`, \`removed_at\`);`);
    this.addSql(`create index \`comment_resource_kind_resource_id_removed_at_created_at_index\` on \`comment\` (\`resource_kind\`, \`resource_id\`, \`removed_at\`, \`created_at\`);`);

    this.addSql(`create table \`comment_reply\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`content\` text not null, \`comment_id\` text not null, \`creator\` text not null, \`parent_id\` text null, \`path\` text not null);`);
    this.addSql(`create index \`comment_reply_created_at_index\` on \`comment_reply\` (\`created_at\`);`);
    this.addSql(`create index \`comment_reply_removed_at_index\` on \`comment_reply\` (\`removed_at\`);`);
    this.addSql(`create index \`comment_reply_updated_at_index\` on \`comment_reply\` (\`updated_at\`);`);
    this.addSql(`create index \`comment_reply_comment_id_parent_id_removed_at_index\` on \`comment_reply\` (\`comment_id\`, \`parent_id\`, \`removed_at\`);`);
    this.addSql(`create index \`comment_reply_comment_id_removed_at_path_index\` on \`comment_reply\` (\`comment_id\`, \`removed_at\`, \`path\`);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists \`comment\`;`);
    this.addSql(`drop table if exists \`comment_reply\`;`);
  }

}
