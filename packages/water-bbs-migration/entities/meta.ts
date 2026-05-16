import { Entity, Filter, Property } from '@mikro-orm/decorators/legacy';

@Filter({
  name: 'softDelete',
  cond: { removedAt: null },
  default: true,
})
@Entity({abstract: true})
export class BaseMetaEntity {
  @Property({ type: 'datetime',index: true, defaultRaw: 'current_timestamp' })
  createdAt: Date = new Date();

  @Property({ 
    type: 'datetime', 
    onUpdate: () => new Date(), 
    nullable: true 
  })
  updatedAt?: Date;

  @Property({ 
    type: 'datetime', 
    nullable: true,
    index: true
  })
  removedAt?: Date;
}