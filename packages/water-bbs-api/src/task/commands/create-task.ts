import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainError, isErr, isOk, isSome, ok, Result } from 'water-bbs-shared';
import { CreateTaskRequest } from '../dto/create-task.dto';
import { RewardRegistry, TaskRegistry } from '@app/gamification';
import { Task } from 'water-bbs-migration';

export class CreateTaskCommand extends Command<
  Result<{ taskId: string }, DomainError>
> {
  constructor(public req: CreateTaskRequest) {
    super();
  }
}

@CommandHandler(CreateTaskCommand)
export class CreateTask implements ICommandHandler<CreateTaskCommand> {
  constructor(
    private readonly taskRegistry: TaskRegistry,
    private readonly rewardResgitry: RewardRegistry,
  ) {}
  async execute(
    command: CreateTaskCommand,
  ): Promise<Result<{ taskId: string }, DomainError>> {
    const { code, label, description, condition, period, rewardCodes, params } =
      command.req;
    const task = Task.create(
      code,
      label,
      description,
      condition,
      period,
      params,
    );
    const rewardJob = rewardCodes
      .map((code) => this.rewardResgitry.getRewardHandler(code))
      .filter((value) => isSome(value))
      .map((value) => value.value.code)
      .map((code) => this.rewardResgitry.getEntity(code));
    const rewardResult = await Promise.all(rewardJob);
    const errs = rewardResult.filter(isErr);
    if (errs.length) {
      return errs[0];
    }
    const rewards = rewardResult
      .filter(isOk)
      .map((res) => res.value)
      .filter(isSome)
      .map((s) => s.value);
    const resgiterResult = await this.taskRegistry.register(task, rewards);
    if (isErr(resgiterResult)) {
      return resgiterResult;
    }
    return ok({ taskId: task.id });
  }
}
