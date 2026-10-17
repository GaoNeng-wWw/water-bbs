import { EntityManager } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { Fields, Task } from '../../schema';
import { AccountId } from 'src/auth';
import { fieldExtractor } from '../../domain';
import { FieldDiscoverService } from '../../infra/field/field.discover';
import { evalCondition } from '../../domain/service/condition-evaluator/evaluator';
import { err, ok } from 'neverthrow';
import { RewardService } from '../../infra/reward';
import { InfraError } from '@app/shared';
import { DeliverConditionUnmet } from '../error';

@Injectable()
export class TaskRunnerService {
  constructor(
    private readonly em: EntityManager,
    private readonly fieldService: FieldDiscoverService,
    private readonly rewardService: RewardService,
  ) {}
  async run(task: Task, accountID: AccountId) {
    const fields = Array.from(new Set(fieldExtractor(task.condition)));
    const tasks = fields.map((field) => {
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
    const context = results.reduce((pre, cur) => {
      return {
        ...pre,
        [cur.field]: cur.value,
      };
    }, {});
    const allResult = evalCondition(task.condition, context);
    if (allResult.isErr()) {
      return allResult;
    }
    const pass = allResult.isOk() && allResult.value;
    if (!pass) {
      return err(new DeliverConditionUnmet());
    }
    const rewardTasks = task.reward.map((r) => {
      return this.rewardService.call(r.use, { ...r.args, accountID });
    });
    const runResult = await Promise.all(rewardTasks)
      .then((result) => {
        return result.filter((res) => res.isErr());
      })
      .catch((reason) => {
        return [err(new InfraError(reason).toApplicationError())];
      });
    if (runResult.length > 0) {
      const [fail] = runResult;
      return fail;
    }
    return ok(true);
  }
}
