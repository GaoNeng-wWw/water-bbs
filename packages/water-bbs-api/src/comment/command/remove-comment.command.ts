import { DomainError } from '@app/shared';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { Comment, CommentId } from '../comment.entity';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CommentNotFound } from '../error';

export class RemoveComment extends Command<Result<CommentId, DomainError>> {
  constructor(public readonly commentId: CommentId) {
    super();
  }
}

@CommandHandler(RemoveComment)
export class RemoveCommentService implements ICommandHandler<RemoveComment> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: EntityRepository<Comment>,
  ) {}
  async execute({
    commentId,
  }: RemoveComment): Promise<Result<CommentId, DomainError>> {
    const id = commentId;
    const comment = await this.commentRepo.findOne({ id });
    if (!comment) {
      return err(new CommentNotFound(id));
    }
    comment.removedAt = new Date();
    await this.commentRepo.upsert(comment);
    return ok(comment.id);
  }
}
