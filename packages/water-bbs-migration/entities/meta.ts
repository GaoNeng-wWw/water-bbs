import { Entity, Filter, Property } from '@mikro-orm/decorators/legacy';

@Filter({
  name: 'softDelete',
  cond: { removedAt: null },
  default: true,
})
@Entity({abstract: true})
export class BaseMetaEntity {
  @Property({ type: 'tstz',index: true})
  createdAt: Date = new Date();

  @Property({ 
    type: 'tstz', 
    onUpdate: () => new Date(), 
    nullable: true 
  })
  updatedAt?: Date;

  @Property({ 
    type: 'tstz', 
    nullable: true,
    index: true
  })
  removedAt?: Date;
}