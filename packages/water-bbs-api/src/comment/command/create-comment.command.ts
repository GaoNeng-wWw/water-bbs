import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { Comment, CommentId, ResourceKind } from '../comment.entity';
import { DomainError } from '@app/shared';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CommentAlreadyExists } from '../error';

export class CreateComment extends Command<Result<CommentId, DomainError>> {
  constructor(
    public readonly resourceId: string,
    public readonly resourceKind: ResourceKind,
  ) {
    super();
  }
}

@CommandHandler(CreateComment)
export class CreateCommentService implements ICommandHandler<CreateComment> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
  ) {}
  async execute({
    resourceId,
    resourceKind,
  }: CreateComment): Promise<Result<CommentId, DomainError>> {
    const dbComment = await this.commentRepository.findOne({
      resourceId,
      resourceKind,
    });
    if (dbComment) {
      return err(new CommentAlreadyExists());
    }
    const comment = this.commentRepository.create({
      resourceId,
      resourceKind,
    });
    await this.commentRepository.upsert(comment);
    return ok(comment.id);
  }
}
