import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Permission, Role } from "../entities";

export const BUILTIN_ROLES = [
  'admin',
];

export class RoleSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log('RoleSeeder run');
    const superPermission = await em.findOneOrFail(Permission, {
      code: '*',
    });

    for (const role of BUILTIN_ROLES) {
      if (await em.findOne(Role, {
        code: role,
      })) {
        continue;
      }
      const r = Role.create(role, role, [superPermission]);
      await em.upsert(Role, r);
    }
  }
}