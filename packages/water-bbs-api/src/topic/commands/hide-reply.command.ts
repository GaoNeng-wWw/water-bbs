import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { Reply, ReplyId } from '../entites';
import { DomainError, HiddenPeriod } from '@app/shared';
import { EntityManager } from '@mikro-orm/sqlite';
import { ReplyNotFound } from '../errors';

export class HideReplyCommand extends Command<Result<ReplyId, DomainError>> {
  constructor(
    public readonly replyId: ReplyId,
    public readonly reason: string,
    public readonly endDate: Date,
  ) {
    super();
  }
}

@CommandHandler(HideReplyCommand)
export class HideReplyCommandService implements ICommandHandler<HideReplyCommand> {
  async execute({
    replyId,
    reason,
    endDate,
  }: HideReplyCommand): Promise<Result<ReplyId, DomainError>> {
    const reply = await this.em.findOne(Reply, { id: replyId });
    if (!reply) {
      return err(new ReplyNotFound(replyId));
    }
    const hiddenPeriod = HiddenPeriod.create(reason, endDate);
    if (hiddenPeriod.isErr()) {
      return hiddenPeriod;
    }
    reply.hiddenPeriod = hiddenPeriod.value;
    this.em.persist(reply);
    await this.em.flush();
    return ok(reply.id);
  }
  constructor(private readonly em: EntityManager) {}
}
