import {
  Command,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { Reply, Topic, TopicId } from '../entites';
import { err, ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { AccountId } from '../../auth';
import { Category, CategoryId } from '../../category';
import { EntityManager } from '@mikro-orm/core';
import { CategoryNotFound } from '../errors';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { TopicCreated } from '../events';

export class CreateTopicCommand extends Command<Result<TopicId, DomainError>> {
  constructor(
    public title: string,
    public content: string,
    public authorId: AccountId,
    public categoryId: CategoryId,
  ) {
    super();
  }
}

@CommandHandler(CreateTopicCommand)
export class CreateTopicService implements ICommandHandler<CreateTopicCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly redisSrv: RedisService,
    private readonly eb: EventBus,
  ) {}
  async execute(
    command: CreateTopicCommand,
  ): Promise<Result<TopicId, DomainError>> {
    const category = await this.em.findOne(Category, {
      id: command.categoryId,
    });
    if (!category) {
      return err(new CategoryNotFound());
    }

    const topic = this.em.create(Topic, {
      title: command.title,
      authorId: command.authorId,
      categoryId: command.categoryId,
    });
    const reply = this.em.create(Reply, {
      content: command.content,
      authorId: command.authorId,
      topicId: topic.id,
    });
    const redis = this.redisSrv.getOrThrow();
    await this.em.transactional(async (em) => {
      em.persist(topic);
      em.persist(reply);
      await em.flush();
      await redis.incr(`category:${command.categoryId}:topic`);
    });
    this.eb.publish(new TopicCreated(command.authorId, topic.id));
    return ok(topic.id);
  }
}
