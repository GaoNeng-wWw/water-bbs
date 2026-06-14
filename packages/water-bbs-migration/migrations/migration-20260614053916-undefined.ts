import { Migration } from '@mikro-orm/migrations';

export class Migration20260614053916 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table \`post\` add \`hide_due\` datetime null;`);

    this.addSql(`alter table \`proposals\` modify \`approval_percent\` numeric(5,2) not null default 50;`);
    this.addSql(`alter table \`proposals\` modify \`content\` text not null default ('');`);
    this.addSql(`alter table \`proposals\` modify \`executor_id\` text not null default ('');`);
    this.addSql(`alter table \`proposals\` modify \`id\` varchar(36) not null default '019ec4a4-3367-770e-80f8-a50a1a4358d9';`);
    this.addSql(`alter table \`proposals\` modify \`reason\` text not null default ('');`);
    this.addSql(`alter table \`proposals\` modify \`title\` text not null default ('');`);

    this.addSql(`alter table \`vote\` modify \`comment\` text not null default ('');`);
    this.addSql(`alter table \`vote\` modify \`id\` varchar(36) not null default '019ec4a4-3369-72e9-98b1-7cbad6c977dd';`);

    this.addSql(`alter table \`vote_slot\` modify \`id\` varchar(36) not null default '019ec4a4-3369-72e9-98b1-82a914d8e056';`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table \`post\` drop column \`hide_due\`;`);

    this.addSql(`alter table \`proposals\` modify \`id\` varchar(36) not null default '019eb551-5063-73c7-94b6-830a6411ee33';`);
    this.addSql(`alter table \`proposals\` modify \`title\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);
    this.addSql(`alter table \`proposals\` modify \`content\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);
    this.addSql(`alter table \`proposals\` modify \`approval_percent\` numeric(5,2) not null default 50.00;`);
    this.addSql(`alter table \`proposals\` modify \`reason\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);
    this.addSql(`alter table \`proposals\` modify \`executor_id\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);

    this.addSql(`alter table \`vote\` modify \`id\` varchar(36) not null default '019eb551-5064-7033-9035-0c1af8d7968f';`);
    this.addSql(`alter table \`vote\` modify \`comment\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);

    this.addSql(`alter table \`vote_slot\` modify \`id\` varchar(36) not null default '019eb551-5064-7033-9035-13f79cf042ec';`);
  }

}
