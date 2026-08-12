import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Category } from 'src/category';

export class CategorySeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const dbCategory = await em.find(Category, {}, { limit: 1 });
    if (dbCategory.length) {
      return;
    }
    const category = em.create(Category, {
      name: '日常',
    });
    em.persist(category);
    await em.flush();
  }
}
