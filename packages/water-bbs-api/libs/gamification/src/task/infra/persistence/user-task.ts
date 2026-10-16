import { v7 } from 'uuid';
import type { AccountId } from 'src/auth';
import { type TaskID } from './task-def';
import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { MetaEntity } from '@app/shared';
import { type Opt } from '@mikro-orm/core';
import { err, ok } from 'neverthrow';
import { TaskCancelled, TaskCompleted } from '../error';

export type UserTaskID = string & { readonly __brand: unique symbol };
export const createUserTaskID = () => v7() as UserTaskID;
export const toUserTaskID = (val: string) => val as UserTaskID;

export enum UserTaskStatus {
  Progress,
  Completed,
  Cancelled,
}
@Entity()
export class UserTask extends MetaEntity {
  @PrimaryKey({ type: 'uuid', onCreate: createUserTaskID })
  id: Opt<UserTaskID>;

  @Property({ type: 'uuid', index: true })
  accountID: AccountId;

  @Property({ type: 'uuid', index: true })
  taskID: TaskID;

  @Property({ type: 'jsonb' })
  snapshot: Record<string, any>;

  @Enum(() => UserTaskStatus)
  status: UserTaskStatus;

  complete() {
    if (this.status === UserTaskStatus.Cancelled) {
      return err(new TaskCancelled());
    }
    this.status = UserTaskStatus.Completed;
    return ok();
  }
  cancel() {
    if (this.status === UserTaskStatus.Completed) {
      return err(new TaskCompleted());
    }
    this.status = UserTaskStatus.Cancelled;
    return ok();
  }
}
