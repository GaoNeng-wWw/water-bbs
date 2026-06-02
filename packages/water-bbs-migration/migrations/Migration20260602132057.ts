import { Migration } from '@mikro-orm/migrations';

export class Migration20260602132057 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table \`proposals\` modify \`id\` varchar(36) not null default '019e887e-93cd-7628-bb4d-35764c8ee75c';`);

    this.addSql(`alter table \`vote\` modify \`id\` varchar(36) not null default '019e887e-93ce-701d-96ed-14d1e5991bb1';`);

    this.addSql(`alter table \`vote_slot\` modify \`id\` varchar(36) not null default '019e887e-93cf-772b-a26e-b3995ad2a730';`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table \`proposals\` modify \`id\` varchar(36) not null default '019e887e-41e8-75df-bc2a-f20785b7cdc8';`);

    this.addSql(`alter table \`vote\` modify \`id\` varchar(36) not null default '019e887e-41e9-7683-85ad-d37c5c84c184';`);

    this.addSql(`alter table \`vote_slot\` modify \`id\` varchar(36) not null default '019e887e-41e9-7683-85ad-d437a196108c';`);
  }

}
