import { QueryHandler, IQueryHandler, Query } from '@nestjs/cqrs';
import { Comment, CommentId } from '../comment.entity';
import { ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { EntityRepository } from '@mikro-orm/sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';

export type CommentList = CommentId[];

export class ListCommentId extends Query<Result<CommentList, DomainError>> {
  constructor(public readonly resourceId: string[]) {
    super();
  }
}

@QueryHandler(ListCommentId)
export class ListCommentIdService implements IQueryHandler<ListCommentId> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
  ) {}
  async execute({
    resourceId,
  }: ListCommentId): Promise<Result<CommentList, DomainError>> {
    const comments = await this.commentRepository.find(
      {
        resourceId: {
          $in: resourceId,
        },
      },
      {
        fields: ['id'],
      },
    );
    return ok(comments.map((comment) => comment.id));
  }
}
