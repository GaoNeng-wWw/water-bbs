import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { TriggerEntity, TriggerId } from '../trigger.entity';
import { DomainError } from '@app/shared';
import { TriggerDiscover } from '../trigger-discover.service';
import { EntityManager } from '@mikro-orm/sqlite';
import { TriggerNotFound } from '../errors';

export class RemoveTrigger extends Command<Result<TriggerId, DomainError>> {
  constructor(public readonly triggerId: TriggerId) {
    super();
  }
}

@CommandHandler(RemoveTrigger)
export class RemoveTriggerService implements ICommandHandler<RemoveTrigger> {
  constructor(
    private readonly triggerRegistry: TriggerDiscover,
    private readonly em: EntityManager,
  ) {}
  async execute(
    command: RemoveTrigger,
  ): Promise<Result<TriggerId, DomainError>> {
    const id = command.triggerId;
    const trigger = await this.em.findOne(TriggerEntity, { id });
    if (!trigger) {
      return err(new TriggerNotFound(id));
    }
    trigger.remove();
    this.triggerRegistry.removeTrigger(trigger);
    await this.em.upsert(TriggerEntity, trigger);
    return ok(trigger.id);
  }
}
