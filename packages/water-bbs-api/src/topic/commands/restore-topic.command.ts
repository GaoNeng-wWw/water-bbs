import { DomainError } from '@app/shared';
import { Topic, TopicId } from '../entites';
import { err, ok, Result } from 'neverthrow';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/core';
import { TopicNotFound } from '../errors';

export class RestoreTopicCommand extends Command<Result<TopicId, DomainError>> {
  constructor(public readonly topicId: TopicId) {
    super();
  }
}

@CommandHandler(RestoreTopicCommand)
export class RestoreTopicService implements ICommandHandler<RestoreTopicCommand> {
  constructor(private readonly em: EntityManager) {}
  async execute(command: RestoreTopicCommand): Promise<any> {
    const topic = await this.em.findOne(
      Topic,
      { id: command.topicId },
      { filters: ['notRemoved'] },
    );
    if (!topic) {
      return err(new TopicNotFound(command.topicId));
    }
    topic.hiddenPeriod = undefined;
    this.em.persist(topic);
    await this.em.flush();
    return ok(topic.id);
  }
}
