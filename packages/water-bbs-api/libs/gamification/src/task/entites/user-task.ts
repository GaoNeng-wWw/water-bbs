import { MetaEntity } from '@app/shared';
import { type Opt } from '@mikro-orm/core';
import { v7 } from 'uuid';
import type { IReward } from '../schema';
import { type AccountId } from 'src/auth';
import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { err, ok } from 'neverthrow';
import { StatusTransferError } from '../error';
import { type TaskID } from './task-def';

export type UserTaskID = string & { readonly __brand: unique symbol };
export const createUserTaskID = () => v7() as UserTaskID;

export enum UserTaskStatus {
  Complete = 'complete',
  Progress = 'progress',
  Abandon = 'abandon',
}

@Entity()
export class UserTask extends MetaEntity {
  @PrimaryKey({ type: 'uuid', onCreate: () => createUserTaskID() })
  id: Opt<UserTaskID>;
  @Property({ type: 'uuid' })
  accountID: AccountId;
  @Property({ type: 'uuid', index: true })
  taskID: TaskID;
  @Property({ type: 'jsonb' })
  snapshot: IReward;
  @Enum(() => UserTaskStatus)
  status: UserTaskStatus;
  complete() {
    if (this.status !== UserTaskStatus.Progress) {
      return err(
        new StatusTransferError(
          [UserTaskStatus.Progress.toString()],
          [this.status.toString()],
        ),
      );
    }
    this.status = UserTaskStatus.Complete;
    return ok();
  }
  abandon() {
    if (this.status !== UserTaskStatus.Progress) {
      return err(
        new StatusTransferError(
          [UserTaskStatus.Progress.toString()],
          [this.status.toString()],
        ),
      );
    }
    this.status = UserTaskStatus.Abandon;
    return ok();
  }
}