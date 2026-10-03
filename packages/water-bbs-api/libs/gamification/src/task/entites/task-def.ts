import { MetaEntity } from '@app/shared';
import { type Opt } from '@mikro-orm/core';
import { v7 } from 'uuid';
import type { IReward } from '../schema';
import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

export type TaskID = string & { readonly __brand: unique symbol };
export const createTaskID = () => v7() as TaskID;

@Entity()
export class TaskDefinition extends MetaEntity {
  @PrimaryKey({
    type: 'uuid',
    onCreate: () => createTaskID(),
  })
  id: Opt<TaskID>;
  @Property({ type: 'text', nullable: false })
  name: string;
  @Property({ type: 'text', nullable: false })
  desc: string;
  @Property({ type: 'text', nullable: true })
  icon: string;
  @Property({ type: 'jsonb' })
  schema: IReward;
}
