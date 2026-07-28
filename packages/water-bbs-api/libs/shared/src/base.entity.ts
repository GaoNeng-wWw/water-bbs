import { type Opt } from '@mikro-orm/core';
import { Embeddable, Property } from '@mikro-orm/decorators/legacy';

@Embeddable()
export class MetaEntity {
  @Property({ type: 'datetime', index: true })
  createdAt: Opt<Date> = new Date();
  @Property({ type: 'datetime', index: true, nullable: true })
  removedAt: Opt<Date>;
  @Property({ type: 'datetime', index: true, nullable: true })
  updatedAt: Opt<Date>;
}
