import type { Opt } from '@mikro-orm/core';
import type { AccountId } from '../../auth';
import { HiddenPeriod, MetaEntity } from '@app/shared';
import {
  Embedded,
  Entity,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import type { CategoryId } from '../../category';
import { v7 } from 'uuid';

export type TopicId = string & { readonly __brand: unique symbol };

@Entity({ tableName: 'topic' })
export class Topic extends MetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: Opt<TopicId> = v7() as TopicId;
  @Property({ type: 'text' })
  title: string;
  @Property({ type: 'uuid' })
  authorId: AccountId;
  @Property({ type: 'uuid' })
  categoryId: CategoryId;

  @Embedded(() => HiddenPeriod, {
    nullable: true,
    prefix: 'hidden_',
  })
  hiddenPeriod?: HiddenPeriod;

  remove() {
    this.removedAt = new Date();
  }
  restore() {
    this.removedAt = null;
  }
}
