import { WorkflowId } from '@app/engine/workflow';
import { TriggerEntity, TriggerId, TriggerKind } from '../trigger.entity';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/sqlite';
import { ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';

export type CreateConditionTrigger = {
  name: string;
  workflowId: WorkflowId;
  conditon: Record<string, any>;
  kind: TriggerKind.Condition;
};
export type CreateCronTrigger = {
  name: string;
  workflowId: WorkflowId;
  cron: string;
  kind: TriggerKind.Cron;
};

export class CreateTrigger extends Command<Result<TriggerId, DomainError>> {
  constructor(public readonly dto: CreateConditionTrigger | CreateCronTrigger) {
    super();
  }
}

@CommandHandler(CreateTrigger)
export class CreateTriggerService implements ICommandHandler<CreateTrigger> {
  constructor(private readonly em: EntityManager) {}
  async execute(command: CreateTrigger): Promise<any> {
    const dto = command.dto;
    const trigger = this.em.create(TriggerEntity, {
      ...dto,
    });
    this.em.persist(trigger);
    await this.em.flush();
    return ok({ id: trigger.id });
  }
}
