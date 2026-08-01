import {
  Command,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { Reply, ReplyId, Topic, TopicId } from '../entites';
import { DomainError } from '@app/shared';
import { AccountId } from '../../auth';
import { EntityManager } from '@mikro-orm/core';
import { TopicNotFound } from '../errors';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ReplyCreated } from '../events';

export class CreateReplyCommand extends Command<Result<ReplyId, DomainError>> {
  constructor(
    public readonly topicId: TopicId,
    public readonly content: string,
    public readonly accountId: AccountId,
  ) {
    super();
  }
}

@CommandHandler(CreateReplyCommand)
export class CreateReplyService implements ICommandHandler<CreateReplyCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly redisSrv: RedisService,
    private readonly eventBus: EventBus,
  ) {}
  async execute(
    command: CreateReplyCommand,
  ): Promise<Result<ReplyId, DomainError>> {
    const topic = await this.em.findOne(Topic, {
      id: command.topicId,
    });
    if (!topic) {
      return err(new TopicNotFound(command.topicId));
    }
    const reply = this.em.create(Reply, {
      topicId: command.topicId,
      content: command.content,
      authorId: command.accountId,
    });
    const redis = this.redisSrv.getOrThrow();
    await this.em.transactional(async (em) => {
      em.persist(reply);
      await em.flush();
      await redis.incr(`topic:${command.topicId}:reply`);
    });
    this.eventBus.publish(
      new ReplyCreated(command.topicId, reply.id, command.accountId),
    );
    return ok(reply.id);
  }
}
