import { MetaEntity } from '@app/shared';
import { type Opt } from '@mikro-orm/core';
import { v7 } from 'uuid';
import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { type RewardTaggedValue } from '../schema';

export type UserTaskProgressID = string & { readonly __brand: unique symbol };
export const createUserTaskProgressID = () => v7() as UserTaskProgressID;

@Entity()
export class UserTaskProgress extends MetaEntity {
  @PrimaryKey({ type: 'uuid', onCreate: () => createUserTaskProgressID() })
  id: Opt<UserTaskProgressID>;
  @Property({ type: 'text' })
  conditionID: string;
  @Property({ type: 'jsonb' })
  goal: RewardTaggedValue;
  @Property({ type: 'jsonb' })
  current: RewardTaggedValue;
}
