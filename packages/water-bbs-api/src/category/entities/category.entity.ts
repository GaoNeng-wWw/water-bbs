import { MetaEntity } from '@app/shared';
import { type Opt } from '@mikro-orm/core';
import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { v7 } from 'uuid';

export type CategoryId = string & { readonly __brand: unique symbol };

export const createCategoryId = () => v7() as CategoryId;

@Entity({ tableName: 'category' })
export class Category extends MetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: Opt<CategoryId> = createCategoryId();
  @Property({ type: 'text', nullable: true })
  icon: Opt<string>;
  @Property({ type: 'text' })
  name: string;
  @Property({ type: 'text', length: 7, nullable: true })
  color: Opt<string>;
  @Property({ type: 'bool' })
  pined: Opt<boolean> = false;
  remove() {
    this.removedAt = new Date();
  }
  pin() {
    this.pined = true;
  }
  recover() {
    this.removedAt = null;
  }
}
