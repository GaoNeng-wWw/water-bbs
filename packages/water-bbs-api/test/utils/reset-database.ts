import { MikroORM } from '@mikro-orm/core';

export async function resetDatabase(orm: MikroORM): Promise<void> {
  await orm.schema.refresh();
}