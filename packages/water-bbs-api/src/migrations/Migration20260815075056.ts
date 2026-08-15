import { Migration } from '@mikro-orm/migrations';

export class Migration20260815075056 extends Migration {

  override name = 'Migration20260815075056';

  override up(): void | Promise<void> {
    this.addSql(`create table \`transaction\` (\`id\` text not null primary key, \`from\` text not null, \`to\` text not null, \`amount\` bigint not null, \`status\` text check (\`status\` in ('success', 'pending', 'fail')) not null, \`detail\` text not null);`);
    this.addSql(`create index \`transaction_from_index\` on \`transaction\` (\`from\`);`);
    this.addSql(`create index \`transaction_to_index\` on \`transaction\` (\`to\`);`);
    this.addSql(`create index \`transaction_status_index\` on \`transaction\` (\`status\`);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists \`transaction\`;`);
  }

}
