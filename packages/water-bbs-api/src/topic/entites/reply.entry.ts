import { HiddenPeriod, MetaEntity } from '@app/shared';
import type { Opt } from '@mikro-orm/core';
import { v7 } from 'uuid';
import type { TopicId } from './topic.entry';
import type { AccountId } from '../../auth';
import {
  Embedded,
  Entity,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';

export type ReplyId = string & { readonly __brand: unique symbol };

@Entity({ tableName: 'reply' })
export class Reply extends MetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: Opt<ReplyId> = v7() as ReplyId;
  @Property({ type: 'uuid' })
  topicId: TopicId;
  @Property({ type: 'longtext' })
  content: string;
  @Property({ type: 'uuid' })
  authorId: AccountId;

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
