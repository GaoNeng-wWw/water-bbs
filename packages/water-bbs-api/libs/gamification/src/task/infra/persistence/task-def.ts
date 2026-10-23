import { MetaEntity } from '@app/shared';
import { type Opt } from '@mikro-orm/core';
import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { v7 } from 'uuid';
import { type Task } from '../../schema';

export type TaskID = string & { readonly __brand: unique symbol };
export const createTaskID = () => v7() as TaskID;
export const toTaskID = (value: string) => value as TaskID;

@Entity()
export class TaskDefinition extends MetaEntity {
  @PrimaryKey({
    type: 'uuid',
    onCreate: createTaskID,
  })
  id: Opt<TaskID>;
  @Property({ type: 'varchar' })
  name: string;
  @Property({ type: 'varchar' })
  desc: string;
  @Property({ type: 'text', nullable: true })
  icon: string;
  @Property({ type: 'jsonb' })
  condition: Task['condition'];
  @Property({ type: 'jsonb' })
  reward: Task['reward'];
  @Property({ type: 'jsonb' })
  schedule: Task['schedule'];
  @Property({ type: 'jsonb' })
  claim: Task['claim'];
}
