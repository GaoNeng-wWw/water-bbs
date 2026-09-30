import { DomainError } from '@app/shared';
import { Reply, ReplyId } from '../entites';
import { err, ok, Result } from 'neverthrow';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/core';
import { ReplyNotFound } from '../errors';

export class RestoreReplyCommand extends Command<Result<ReplyId, DomainError>> {
  constructor(public readonly replyId: ReplyId) {
    super();
  }
}

@CommandHandler(RestoreReplyCommand)
export class RestoreReplyService implements ICommandHandler<RestoreReplyCommand> {
  constructor(private readonly em: EntityManager) {}
  async execute(command: RestoreReplyCommand) {
    const reply = await this.em.findOne(
      Reply,
      { id: command.replyId },
      { filters: ['notRemoved'] },
    );
    if (!reply) {
      return err(new ReplyNotFound(command.replyId));
    }
    reply.hiddenPeriod = undefined;
    this.em.persist(reply);
    await this.em.flush();
    return ok(reply.id);
  }
}
