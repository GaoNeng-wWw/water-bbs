import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { AccountSeeder } from './account-seeder';
import { RoleSeeder } from './role-seeder';
import { PermissionSeeder } from './permission-seeder';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await em.transactional(async (em) => {
      await this.call(em, [PermissionSeeder, RoleSeeder, AccountSeeder]);
    })      
  }
}
