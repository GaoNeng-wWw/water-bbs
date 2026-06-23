import { Migration } from '@mikro-orm/migrations';

export class Migration20260623071218 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table \`proposal_comment\` modify \`id\` varchar(36) not null default '019ef352-9bd8-743b-b4a3-3b9a7ebd9cc4';`);
    this.addSql(`alter table \`proposal_comment\` modify \`comment\` text not null default ('');`);

    this.addSql(`alter table \`proposals\` modify \`id\` varchar(36) not null default '019ef352-9bd6-7090-8b44-25a3195469ec';`);
    this.addSql(`alter table \`proposals\` modify \`title\` text not null default ('');`);
    this.addSql(`alter table \`proposals\` modify \`content\` text not null default ('');`);
    this.addSql(`alter table \`proposals\` modify \`approval_percent\` numeric(5,2) not null default 50;`);
    this.addSql(`alter table \`proposals\` modify \`reason\` text not null default ('');`);
    this.addSql(`alter table \`proposals\` modify \`executor_id\` text not null default ('');`);

    this.addSql(`alter table \`vote\` modify \`id\` varchar(36) not null default '019ef352-9bd7-7529-b464-6c4421cee812';`);

    this.addSql(`alter table \`vote_slot\` modify \`id\` varchar(36) not null default '019ef352-9bd7-7529-b464-7006bf563bc2';`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table \`proposal_comment\` modify \`id\` varchar(36) not null default '019ef352-4818-76f9-baaa-9fd24f8b5526';`);
    this.addSql(`alter table \`proposal_comment\` modify \`comment\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);

    this.addSql(`alter table \`proposals\` modify \`id\` varchar(36) not null default '019ef352-4816-749d-a338-3908ba6804c6';`);
    this.addSql(`alter table \`proposals\` modify \`title\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);
    this.addSql(`alter table \`proposals\` modify \`content\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);
    this.addSql(`alter table \`proposals\` modify \`approval_percent\` decimal(5,2) not null default 50.00;`);
    this.addSql(`alter table \`proposals\` modify \`reason\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);
    this.addSql(`alter table \`proposals\` modify \`executor_id\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);

    this.addSql(`alter table \`vote\` modify \`id\` varchar(36) not null default '019ef352-4817-700c-b4f4-ae467d47fa7d';`);

    this.addSql(`alter table \`vote_slot\` modify \`id\` varchar(36) not null default '019ef352-4818-76f9-baaa-9b3bdc257483';`);
  }

}
