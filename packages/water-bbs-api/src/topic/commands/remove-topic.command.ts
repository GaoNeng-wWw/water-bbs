import { DomainError } from '@app/shared';
import { Topic, TopicId } from '../entites';
import { err, ok, Result } from 'neverthrow';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/core';
import { TopicNotFound } from '../errors';
import { RedisService } from '@liaoliaots/nestjs-redis';

export class RemoveTopicCommand extends Command<Result<TopicId, DomainError>> {
  constructor(public readonly id: TopicId) {
    super();
  }
}

@CommandHandler(RemoveTopicCommand)
export class RemoveTopicService implements ICommandHandler<RemoveTopicCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly redisSrv: RedisService,
  ) {}
  async execute(
    command: RemoveTopicCommand,
  ): Promise<Result<TopicId, DomainError>> {
    const topic = await this.em.findOne(Topic, {
      id: command.id,
    });
    if (!topic) {
      return err(new TopicNotFound(command.id));
    }
    this.em.remove(topic);
    const redis = this.redisSrv.getOrThrow();
    await this.em.transactional(async (em) => {
      em.persist(topic);
      await em.flush();
      await redis.decr(`category:${topic.categoryId}:topic`);
      await redis.del(`topic:${command.id}:reply`);
    });
    return ok(topic.id);
  }
}
