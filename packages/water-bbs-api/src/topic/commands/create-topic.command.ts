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
import { JSONContent } from '@tiptap/core';
import { findNode } from '../domain';
import { InjectStorage, toStorageKey, type Storage } from '@app/storage';

export class CreateTopicCommand extends Command<Result<TopicId, DomainError>> {
  constructor(
    public title: string,
    public content: JSONContent,
    public authorId: AccountId,
    public categoryId: CategoryId,
    public pinned?: boolean,
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
    @InjectStorage('topic-image')
    private readonly storage: Storage,
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
      pinned: command.pinned,
    });
    const reply = this.em.create(Reply, {
      content: command.content,
      authorId: command.authorId,
      topicId: topic.id,
    });
    const images: ImageNode[] = findNode<ImageNode>(command.content, (node) => {
      return node.type === 'image';
    });
    const ids = images.map((image) => image.attrs.imageId);
    const redis = this.redisSrv.getOrThrow();
    await this.em.transactional(async (em) => {
      const results = await Promise.all(
        ids.map((id) => this.storage.persistence(toStorageKey(id))),
      );
      const errors = results.filter((result) => result.isErr());
      if (errors.length > 0) {
        return err(errors[0].error);
      }
      results
        .filter((res) => res.isOk())
        .map((res) => res.value)
        .forEach((res) => em.persist(res));

      em.persist(topic);
      em.persist(reply);
      await em.flush();
      await redis.incr(`category:${command.categoryId}:topic`);
    });
    this.eb.publish(
      new TopicCreated(command.authorId, topic.id, command.categoryId),
    );
    return ok(topic.id);
  }
}
