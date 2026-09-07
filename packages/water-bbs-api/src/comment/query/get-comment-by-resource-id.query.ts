import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { Comment, CommentId } from '../comment.entity';
import { err, ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { EntityManager } from '@mikro-orm/sqlite';
import { CommentNotFound } from '../error';

export type GetCommentByResourceIdResponse = {
  id: CommentId;
};

export class GetCommentByResourceId extends Query<
  Result<GetCommentByResourceIdResponse, DomainError>
> {
  constructor(public readonly resourceId: string) {
    super();
  }
}

@QueryHandler(GetCommentByResourceId)
export class GetCommentByResourceIdService implements IQueryHandler<GetCommentByResourceId> {
  async execute({
    resourceId,
  }: GetCommentByResourceId): Promise<
    Result<GetCommentByResourceIdResponse, DomainError>
  > {
    const comment = await this.em.findOne(Comment, {
      resourceId,
    });
    if (!comment) {
      return err(new CommentNotFound());
    }
    return ok({ id: comment.id });
  }
  constructor(private readonly em: EntityManager) {}
}
