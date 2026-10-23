import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Task } from '../../schema';
import { ok, Result } from 'neverthrow';
import { TaskDefinition, TaskID } from '../../infra';
import { ApplicationError } from '@app/shared';
import { EntityManager } from '@mikro-orm/sqlite';

export class CreateTask extends Command<Result<TaskID, ApplicationError>> {
  constructor(public readonly schema: Task) {
    super();
  }
}

@CommandHandler(CreateTask, { durable: true })
export class CreateTaskService implements ICommandHandler<CreateTask> {
  constructor(private readonly em: EntityManager) {}
  async execute(
    command: CreateTask,
  ): Promise<Result<TaskID, ApplicationError>> {
    const schema = command.schema;
    const taskDef = this.em.create(TaskDefinition, {
      name: schema.name,
      desc: '',
      icon: '',
      condition: schema.condition,
      schedule: schema.schedule,
      reward: schema.reward,
      claim: schema.claim,
    });
    this.em.persist(taskDef);
    await this.em.flush();
    return ok(taskDef.id);
  }
}
