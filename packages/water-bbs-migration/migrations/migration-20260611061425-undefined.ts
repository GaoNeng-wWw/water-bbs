import { Migration } from '@mikro-orm/migrations';

export class Migration20260611061425 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table \`proposals\` modify \`id\` varchar(36) not null default '019eb551-5063-73c7-94b6-830a6411ee33';`);

    this.addSql(`alter table \`profile\` add \`avatar_storage_key\` varchar(255) null;`);
    this.addSql(`alter table \`profile\` add constraint \`profile_avatar_storage_key_foreign\` foreign key (\`avatar_storage_key\`) references \`file_reference\` (\`storage_key\`) on delete set null;`);
    this.addSql(`alter table \`profile\` add unique \`profile_avatar_storage_key_unique\` (\`avatar_storage_key\`);`);

    this.addSql(`alter table \`vote\` modify \`id\` varchar(36) not null default '019eb551-5064-7033-9035-0c1af8d7968f';`);

    this.addSql(`alter table \`vote_slot\` modify \`id\` varchar(36) not null default '019eb551-5064-7033-9035-13f79cf042ec';`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table \`profile\` drop foreign key \`profile_avatar_storage_key_foreign\`;`);

    this.addSql(`alter table \`profile\` drop index \`profile_avatar_storage_key_unique\`;`);
    this.addSql(`alter table \`profile\` drop column \`avatar_storage_key\`;`);

    this.addSql(`alter table \`proposals\` modify \`id\` varchar(36) not null default '019eb543-76cf-757d-9c70-32c8255f49bb';`);

    this.addSql(`alter table \`vote\` modify \`id\` varchar(36) not null default '019eb543-76d0-74b6-9866-ee9b1648b85d';`);

    this.addSql(`alter table \`vote_slot\` modify \`id\` varchar(36) not null default '019eb543-76d1-74d8-a933-5ac88bb5538f';`);
  }

}
