import { Migration } from '@mikro-orm/migrations';

export class Migration20260611055918 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table \`proposals\` modify \`id\` varchar(36) not null default '019eb543-76cf-757d-9c70-32c8255f49bb';`);
    this.addSql(`alter table \`proposals\` modify \`title\` text not null default ('');`);
    this.addSql(`alter table \`proposals\` modify \`content\` text not null default ('');`);
    this.addSql(`alter table \`proposals\` modify \`approval_percent\` numeric(5,2) not null default 50;`);
    this.addSql(`alter table \`proposals\` modify \`reason\` text not null default ('');`);
    this.addSql(`alter table \`proposals\` modify \`executor_id\` text not null default ('');`);

    this.addSql(`alter table \`vote\` modify \`id\` varchar(36) not null default '019eb543-76d0-74b6-9866-ee9b1648b85d';`);
    this.addSql(`alter table \`vote\` modify \`comment\` text not null default ('');`);

    this.addSql(`alter table \`vote_slot\` modify \`id\` varchar(36) not null default '019eb543-76d1-74d8-a933-5ac88bb5538f';`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table \`proposals\` modify \`id\` varchar(36) not null default '019eb542-3e00-7349-9484-3476f4a7f618';`);
    this.addSql(`alter table \`proposals\` modify \`title\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);
    this.addSql(`alter table \`proposals\` modify \`content\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);
    this.addSql(`alter table \`proposals\` modify \`approval_percent\` decimal(5,2) not null default 50.00;`);
    this.addSql(`alter table \`proposals\` modify \`reason\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);
    this.addSql(`alter table \`proposals\` modify \`executor_id\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);

    this.addSql(`alter table \`vote\` modify \`id\` varchar(36) not null default '019eb542-3e01-742a-949f-a97abebaac66';`);
    this.addSql(`alter table \`vote\` modify \`comment\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);

    this.addSql(`alter table \`vote_slot\` modify \`id\` varchar(36) not null default '019eb542-3e02-728b-8879-cc733b9b3967';`);
  }

}
