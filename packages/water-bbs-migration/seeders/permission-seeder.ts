import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Permission } from "../entities";

export const permissions = [
  'permission.create',
  'permission.remove',
  'permission.list',
  'permission.find',
  'role.create',
  'role.remove',
  'role.list',
  'role.find',
  'role.update',
  '*'
];

export class PermissionSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log('PermissionSeeder run');
    for (const permission of permissions) {
      if (await em.findOne(Permission, {
        code: permission,
      })) {
        continue;
      }
      const p = Permission.create(permission, permission);
      await em.upsert(Permission, p);
    }
  }
}