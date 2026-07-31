import { DomainError, HiddenPeriod } from '@app/shared';
import { Topic, TopicId } from '../entites';
import { err, ok, Result } from 'neverthrow';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/core';
import { TopicNotFound } from '../errors';

export class HideTopicCommand extends Command<Result<TopicId, DomainError>> {
  constructor(
    public readonly topicId: TopicId,
    public readonly reason: string,
    public readonly endDate: Date,
  ) {
    super();
  }
}

@CommandHandler(HideTopicCommand)
export class HideTopicService implements ICommandHandler<HideTopicCommand> {
  constructor(private readonly em: EntityManager) {}
  async execute(command: HideTopicCommand): Promise<any> {
    const topic = await this.em.findOne(Topic, { id: command.topicId });
    if (!topic) {
      return err(new TopicNotFound(command.topicId));
    }
    const hiddenPeriod = HiddenPeriod.create(command.reason, command.endDate);
    if (hiddenPeriod.isErr()) {
      return hiddenPeriod;
    }
    topic.hiddenPeriod = hiddenPeriod.value;
    this.em.persist(topic);
    await this.em.flush();
    return ok(topic.id);
  }
}
