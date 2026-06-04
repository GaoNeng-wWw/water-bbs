import { Migration } from '@mikro-orm/migrations';

export class Migration20260604072530 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table \`action\` (\`id\` varchar(36) not null, \`name\` text not null, \`schema\` json not null, \`active\` tinyint(1) not null default true, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`alter table \`proposals\` modify \`id\` varchar(36) not null default '019e9185-df47-715d-a7cf-c9aae36edf92';`);

    this.addSql(`alter table \`vote\` modify \`id\` varchar(36) not null default '019e9185-df48-708c-aeea-7911dbec76fb';`);

    this.addSql(`alter table \`vote_slot\` modify \`id\` varchar(36) not null default '019e9185-df48-708c-aeea-7dbb600b92a3';`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists \`action\`;`);

    this.addSql(`alter table \`proposals\` modify \`id\` varchar(36) not null default '019e887e-93cd-7628-bb4d-35764c8ee75c';`);

    this.addSql(`alter table \`vote\` modify \`id\` varchar(36) not null default '019e887e-93ce-701d-96ed-14d1e5991bb1';`);

    this.addSql(`alter table \`vote_slot\` modify \`id\` varchar(36) not null default '019e887e-93cf-772b-a26e-b3995ad2a730';`);
  }

}
