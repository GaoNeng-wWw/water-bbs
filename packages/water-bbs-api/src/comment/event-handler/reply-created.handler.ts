import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReplyCreated } from '../../topic';
import { EntityManager } from '@mikro-orm/core';
import { Comment, ResourceKind } from '../comment.entity';

@EventsHandler(ReplyCreated)
export class ReplyCreatedHandler implements IEventHandler<ReplyCreated> {
  constructor(private readonly em: EntityManager) {}
  async handle(event: ReplyCreated) {
    const { replyId } = event;
    const comment = this.em.create(Comment, {
      resourceId: replyId,
      resourceKind: ResourceKind.TopicReply,
    });
    this.em.persist(comment);
    await this.em.flush();
  }
}
