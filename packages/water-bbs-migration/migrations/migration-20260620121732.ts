import { Migration } from '@mikro-orm/migrations';

export class Migration20260620121732 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table \`resource\` (\`id\` varchar(36) not null, \`subject\` varchar(36) not null, \`cost\` int not null default 0, \`file_reference_id\` varchar(36) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`resource\` add index \`resource_subject_index\` (\`subject\`);`);
    this.addSql(`alter table \`resource\` add index \`resource_file_reference_id_index\` (\`file_reference_id\`);`);

    this.addSql(`create table \`resource_owner_map\` (\`id\` varchar(36) not null, \`owner\` varchar(36) not null, \`resource_id\` varchar(36) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`resource_owner_map\` add index \`resource_owner_map_owner_index\` (\`owner\`);`);
    this.addSql(`alter table \`resource_owner_map\` add index \`resource_owner_map_resource_id_index\` (\`resource_id\`);`);

    this.addSql(`alter table \`proposal_comment\` modify \`comment\` text not null default ('');`);
    this.addSql(`alter table \`proposal_comment\` modify \`id\` varchar(36) not null default '019ee4f6-fcd2-702f-b380-38fc532e6184';`);

    this.addSql(`alter table \`proposals\` modify \`approval_percent\` numeric(5,2) not null default 50;`);
    this.addSql(`alter table \`proposals\` modify \`content\` text not null default ('');`);
    this.addSql(`alter table \`proposals\` modify \`executor_id\` text not null default ('');`);
    this.addSql(`alter table \`proposals\` modify \`id\` varchar(36) not null default '019ee4f6-fcd1-71df-a260-e98bacfba369';`);
    this.addSql(`alter table \`proposals\` modify \`reason\` text not null default ('');`);
    this.addSql(`alter table \`proposals\` modify \`title\` text not null default ('');`);

    this.addSql(`alter table \`vote\` modify \`id\` varchar(36) not null default '019ee4f6-fcd2-702f-b380-3007f5a0f13a';`);

    this.addSql(`alter table \`vote_slot\` modify \`cnt\` int not null default 1;`);
    this.addSql(`alter table \`vote_slot\` modify \`id\` varchar(36) not null default '019ee4f6-fcd2-702f-b380-35b9d17b18f4';`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists \`resource\`;`);
    this.addSql(`drop table if exists \`resource_owner_map\`;`);

    this.addSql(`alter table \`proposal_comment\` modify \`id\` varchar(36) not null default '019ecee3-d4cd-7646-b139-2e93b4166894';`);
    this.addSql(`alter table \`proposal_comment\` modify \`comment\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);

    this.addSql(`alter table \`proposals\` modify \`id\` varchar(36) not null default '019ecee3-d4c6-769d-97dd-cb1f0c25ef70';`);
    this.addSql(`alter table \`proposals\` modify \`title\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);
    this.addSql(`alter table \`proposals\` modify \`content\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);
    this.addSql(`alter table \`proposals\` modify \`approval_percent\` numeric(5,2) not null default 50.00;`);
    this.addSql(`alter table \`proposals\` modify \`reason\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);
    this.addSql(`alter table \`proposals\` modify \`executor_id\` text not null default ('_utf8mb4\\\\\\'\\\\\\'');`);

    this.addSql(`alter table \`vote\` modify \`id\` varchar(36) not null default '019ecee3-d4cc-7590-8e32-a2403d3905e9';`);

    this.addSql(`alter table \`vote_slot\` modify \`id\` varchar(36) not null default '019ecee3-d4cc-7590-8e32-a54cc44e8046';`);
    this.addSql(`alter table \`vote_slot\` modify \`cnt\` int not null default 0;`);
  }

}
