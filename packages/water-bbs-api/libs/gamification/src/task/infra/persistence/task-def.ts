import { DomainError, MetaEntity } from '@app/shared';
import { type Opt } from '@mikro-orm/core';
import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { v7 } from 'uuid';
import { type Task } from '../../schema';
import { UserTask, UserTaskStatus } from './user-task';
import {
  Day,
  differenceInCalendarWeeks,
  differenceInHours,
  differenceInMonths,
} from 'date-fns';
import { err, ok, Result } from 'neverthrow';
import {
  TaskInProgress,
  TaskScheduleOnce,
  TaskResetNever,
  TaskCooldownNotExpired,
  UnknownScheduleKind,
} from '../error';

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
  @Property({ type: 'jsonb', nullable: true })
  claim: Opt<Task['claim']>;
  canClaim(userTask: UserTask | null): Result<boolean, DomainError> {
    if (!userTask) {
      return ok(true);
    }
    if (userTask.status === UserTaskStatus.Progress) {
      return err(new TaskInProgress());
    }
    if (this.schedule.kind === 'once') {
      return err(new TaskScheduleOnce());
    }
    if (this.schedule.reset.kind === 'never') {
      return err(new TaskResetNever());
    }
    const updateAt = userTask.updatedAt;
    const now = new Date();
    const duration =
      this.schedule.reset.kind === 'period' ? 1 : this.schedule.reset.days;
    if (this.schedule.kind === 'daily') {
      return differenceInHours(now, updateAt) > 24
        ? ok(true)
        : err(new TaskCooldownNotExpired());
    }
    if (this.schedule.kind === 'weekly') {
      return differenceInCalendarWeeks(now, updateAt, {
        weekStartsOn: this.schedule.weekStart as Day,
      }) > duration
        ? ok(true)
        : err(new TaskCooldownNotExpired());
    }
    if (this.schedule.kind === 'monthly') {
      return differenceInMonths(now, updateAt) > duration
        ? ok(true)
        : err(new TaskCooldownNotExpired());
    }
    return err(new UnknownScheduleKind());
  }
}
