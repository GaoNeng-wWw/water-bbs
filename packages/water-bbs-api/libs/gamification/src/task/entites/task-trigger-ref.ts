import { type Opt } from '@mikro-orm/core';
import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { v7 } from 'uuid';
import { type TaskID } from './task-def';
import { MetaEntity } from '@app/shared';

export type TaskTriggerID = string & { readonly __brand: unique symbol };
export const createTaskTriggerID = () => v7() as TaskTriggerID;

@Entity()
export class TaskTrigger extends MetaEntity {
  @PrimaryKey({
    type: 'uuid',
    onCreate: createTaskTriggerID,
  })
  id: Opt<TaskTriggerID>;
  @Property({ type: 'uuid', index: true })
  taskID: TaskID;
  @Property({ type: 'text', index: true })
  triggerKey: string;
}