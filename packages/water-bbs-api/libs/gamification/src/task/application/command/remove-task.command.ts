import { ApplicationError } from '@app/shared';
import { TaskDefinition, TaskID } from '../../infra';
import { err, ok, Result } from 'neverthrow';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/core';
import { TaskNotFound } from '../error';

export class RemoveTask extends Command<Result<TaskID, ApplicationError>> {
  constructor(public readonly id: TaskID) {
    super();
  }
}

@CommandHandler(RemoveTask)
export class RemoveTaskService implements ICommandHandler<RemoveTask> {
  constructor(private readonly em: EntityManager) {}
  async execute(
    command: RemoveTask,
  ): Promise<Result<TaskID, ApplicationError>> {
    const taskDef = await this.em.findOne(TaskDefinition, {
      id: command.id,
    });
    if (!taskDef) {
      return err(new TaskNotFound());
    }
    taskDef._remove();
    await this.em.flush();
    return ok(command.id);
  }
}
