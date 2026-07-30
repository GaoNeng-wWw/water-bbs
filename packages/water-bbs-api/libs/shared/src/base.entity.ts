import { type Opt } from '@mikro-orm/core';
import {
  BeforeUpdate,
  Embeddable,
  Property,
} from '@mikro-orm/decorators/legacy';

@Embeddable()
export class MetaEntity {
  @Property({ type: 'datetime', index: true })
  createdAt: Opt<Date> = new Date();
  @Property({ type: 'datetime', index: true, nullable: true })
  removedAt: Opt<Date> | null;
  @Property({ type: 'datetime', index: true, nullable: true })
  updatedAt: Opt<Date>;

  @BeforeUpdate()
  onUpdate() {
    this.updatedAt = new Date();
  }
}
