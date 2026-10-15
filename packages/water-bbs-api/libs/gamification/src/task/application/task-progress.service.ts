import { AccountId } from 'src/auth';
import { TaskID, UserTask } from '../infra';
import { EntityManager } from '@mikro-orm/core';
import { Fields, Task, WhenNode } from '../schema';
import { FieldDiscoverService } from '../infra/field/field.discover';
import { Injectable } from '@nestjs/common';
import { ok } from 'neverthrow';
import { TaskProgressCacheService } from './task-progress-cache.service';

const getFieldFromWhen = (when: WhenNode): string[] => {
  if ('all' in when) {
    return when.all.flatMap((all) => {
      return getFieldFromWhen(all);
    });
  }
  if ('any' in when) {
    return when.any.flatMap((any) => {
      return getFieldFromWhen(any);
    });
  }
  if ('not' in when) {
    return when.not.flatMap((n) => {
      return getFieldFromWhen(n);
    });
  }
  return [when.field];
};

@Injectable()
export class TaskProgressService {
  constructor(
    private em: EntityManager,
    private fieldService: FieldDiscoverService,
    private cacheService: TaskProgressCacheService,
  ) {}
  async countProgress(accountID: AccountId, taskID: TaskID) {
    const progress = await this.cacheService.get(accountID, taskID);
    if (progress.length > 0) {
      return ok(progress);
    }
    const userTask = await this.em.findOne(UserTask, {
      taskID: taskID,
    });
    if (!userTask) {
      throw new Error('');
    }
    const snapshot: Task = userTask.snapshot as Task;
    if (!snapshot) {
      throw new Error('');
    }
    const fields = new Set(
      snapshot.condition.flatMap((cond) => getFieldFromWhen(cond)),
    );
    const tasks = Array.from(fields).map((field) => {
      return this.fieldService
        .callHandler(field as Fields, { accountID })
        .then((result) => {
          return {
            field,
            result,
          };
        });
    });
    const taskResults = await Promise.all(tasks);
    const [error] = taskResults.filter((task) => task.result.isErr());
    if (error.result.isErr()) {
      return error.result;
    }
    const results = taskResults
      .map((task) =>
        task.result.isOk()
          ? { field: task.field, value: task.result.value }
          : null,
      )
      .filter((value) => value !== null);
    await this.cacheService.put(accountID, taskID, results);
    return ok(results);
  }
}
