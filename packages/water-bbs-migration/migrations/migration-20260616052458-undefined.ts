import { Migration } from '@mikro-orm/migrations';

export class Migration20260616052458 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table \`proposal_comment\` (\`id\` varchar(36) not null default '019ecee3-d4cd-7646-b139-2e93b4166894', \`created_at\` datetime not null default current_timestamp, \`updated_at\` datetime null, \`removed_at\` datetime null, \`proposal_id\` varchar(36) not null, \`account_id\` varchar(36) not null, \`comment\` text not null default (''), \`action\` enum('yes','no') not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`proposal_comment\` add index \`proposal_comment_created_at_index\` (\`created_at\`);`);
    this.addSql(`alter table \`proposal_comment\` add index \`proposal_comment_removed_at_index\` (\`removed_at\`);`);

    this.addSql(`alter table \`proposals\` modify \`approval_percent\` numeric(5,2) not null default 50;`);
    this.addSql(`alter table \`proposals\` modify \`content\` text not null default ('');`);
    this.addSql(`alter table \`proposals\` modify \`executor_id\` text not null default ('');`);
    this.addSql(`alter table \`proposals\` modify \`id\` varchar(36) not null default '019ecee3-d4c6-769d-97dd-cb1f0c25ef70';`);
    this.addSql(`alter table \`proposals\` modify \`reason\` text not null default ('');`);
    this.addSql(`alter table \`proposals\` modify \`title\` text not null default ('');`);

    this.addSql(`alter table \`vote\` drop column \`comment\`;`);
    this.addSql(`alter table \`vote\` modify \`id\` varchar(36) not null default '019ecee3-d4cc-7590-8e32-a2403d3905e9';`);

    this.addSql(`alter table \`vote_slot\` modify \`id\` varchar(36) not null default '019ecee3-d4cc-7590-8e32-a54cc44e8046';`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists \`proposal_comment\`;`);

    this.addSql(`alter table \`proposals\` modify \`id\` varchar(36) not null default '019ec4a4-3367-770e-80f8-a50a1a4358d9';`);
    this.addSql(`alter table \`proposals\` modify \`title\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);
    this.addSql(`alter table \`proposals\` modify \`content\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);
    this.addSql(`alter table \`proposals\` modify \`approval_percent\` numeric(5,2) not null default 50.00;`);
    this.addSql(`alter table \`proposals\` modify \`reason\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);
    this.addSql(`alter table \`proposals\` modify \`executor_id\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);

    this.addSql(`alter table \`vote\` add \`comment\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);
    this.addSql(`alter table \`vote\` modify \`id\` varchar(36) not null default '019ec4a4-3369-72e9-98b1-7cbad6c977dd';`);

    this.addSql(`alter table \`vote_slot\` modify \`id\` varchar(36) not null default '019ec4a4-3369-72e9-98b1-82a914d8e056';`);
  }

}
