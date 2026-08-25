import { DomainError } from '@app/shared';
import { Comment, CommentId } from '../comment.entity';
import { err, ok, Result } from 'neverthrow';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CommentNotFound } from '../error';

export class RestoreComment extends Command<Result<CommentId, DomainError>> {
  constructor(public readonly commentId: CommentId) {
    super();
  }
}

@CommandHandler(RestoreComment)
export class RestoreCommentService implements ICommandHandler<RestoreComment> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
  ) {}
  async execute(
    command: RestoreComment,
  ): Promise<Result<CommentId, DomainError>> {
    const comment = await this.commentRepository.findOne(
      {
        id: command.commentId,
      },
      {
        filters: {
          notRemoved: false,
        },
      },
    );
    if (!comment) {
      return err(new CommentNotFound(command.commentId));
    }
    comment.removedAt = null;
    await this.commentRepository.upsert(comment);
    return ok(comment.id);
  }
}
