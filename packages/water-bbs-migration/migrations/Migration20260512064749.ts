import { Migration } from '@mikro-orm/migrations';

export class Migration20260512064749 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table \`account\` drop foreign key \`account_role_id_foreign\`;`);

    this.addSql(`alter table \`account\` modify \`role_id\` varchar(36) null;`);
    this.addSql(`alter table \`account\` add constraint \`account_role_id_foreign\` foreign key (\`role_id\`) references \`role\` (\`id\`) on delete set null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table \`account\` drop foreign key \`account_role_id_foreign\`;`);

    this.addSql(`alter table \`account\` modify \`role_id\` varchar(36) not null;`);
    this.addSql(`alter table \`account\` add constraint \`account_role_id_foreign\` foreign key (\`role_id\`) references \`role\` (\`id\`) on update no action on delete no action;`);
  }

}
