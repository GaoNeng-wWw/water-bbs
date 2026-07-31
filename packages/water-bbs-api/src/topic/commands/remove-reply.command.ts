import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Reply, ReplyId } from '../entites';
import { err, ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { EntityManager } from '@mikro-orm/core';
import { ReplyNotFound } from '../errors';
import { RedisService } from '@liaoliaots/nestjs-redis';

export class RemoveReplyCommand extends Command<Result<ReplyId, DomainError>> {
  constructor(public readonly replyId: ReplyId) {
    super();
  }
}

@CommandHandler(RemoveReplyCommand)
export class RemoveReplyService implements ICommandHandler<RemoveReplyCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly redisSrv: RedisService,
  ) {}
  async execute(command: RemoveReplyCommand): Promise<any> {
    const reply = await this.em.findOne(Reply, { id: command.replyId });
    if (!reply) {
      return err(new ReplyNotFound(command.replyId));
    }
    reply.remove();
    const redis = this.redisSrv.getOrThrow();
    await this.em.transactional(async (em) => {
      em.persist(reply);
      await em.flush();
      await redis.decr(`topic:${reply.topicId}:reply`);
    });
    return ok(reply.id);
  }
}
