import { Migration } from '@mikro-orm/migrations';

export class Migration20260815065148 extends Migration {

  override name = 'Migration20260815065148';

  override up(): void | Promise<void> {
    this.addSql(`create table \`wallet\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`removed_at\` datetime null, \`updated_at\` datetime null, \`balance_snapshot\` bigint not null);`);
    this.addSql(`create index \`wallet_created_at_index\` on \`wallet\` (\`created_at\`);`);
    this.addSql(`create index \`wallet_removed_at_index\` on \`wallet\` (\`removed_at\`);`);
    this.addSql(`create index \`wallet_updated_at_index\` on \`wallet\` (\`updated_at\`);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists \`wallet\`;`);
  }

}
