import { IQueryHandler, Query, QueryHandler, QueryBus } from '@nestjs/cqrs';
import { PostRepo } from '../post.repo';
import { FindProfileByAccountIDQuery } from '../../account/application/queries';
import { AuthorSummary, PostSummary } from '../entities/post-summary';
import { PostNotFound } from '../errors';
import { AppError, err, isErr, ok, Result } from 'water-bbs-shared';

export class GetPostSummaryQuery extends Query<Result<PostSummary, AppError>> {
  constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(GetPostSummaryQuery)
export class GetPostSummaryHandler implements IQueryHandler<GetPostSummaryQuery> {
  constructor(
    private readonly repo: PostRepo,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(
    query: GetPostSummaryQuery,
  ): Promise<Result<PostSummary, AppError>> {
    const postRes = await this.repo.findById(query.id);
    if (isErr(postRes)) {
      return postRes;
    }
    const post = postRes.value;
    if (!post) {
      return err(new PostNotFound());
    }
    const findProfileResult = await this.queryBus.execute(
      new FindProfileByAccountIDQuery(post.authorId),
    );
    if (isErr(findProfileResult)) {
      return findProfileResult;
    }
    const profile = findProfileResult.value;
    return ok(
      new PostSummary(
        post.id,
        post.title,
        post.threads[0].content,
        new AuthorSummary(profile.id, profile.nick, profile.avatar),
        post.createdAt,
      ),
    );
  }
}
