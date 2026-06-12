import { IQueryHandler, Query, QueryHandler, QueryBus } from '@nestjs/cqrs';
import { PostRepo } from '../post.repo';
import { FindProfileByAccountIDQuery } from '../../account/queries';
import { AuthorSummary, PostSummary } from '../entities/post-summary';
import { CursorPagination } from '@app/shared';
import { AppError, isErr, ok, Result } from 'water-bbs-shared';

export class GetPostsQuery extends Query<
  Result<CursorPagination<PostSummary>, AppError>
> {
  constructor(
    public readonly size: number,
    public readonly preId?: string,
    public readonly categoryId?: string,
  ) {
    super();
  }
}

@QueryHandler(GetPostsQuery)
export class GetPostsHandler implements IQueryHandler<GetPostsQuery> {
  constructor(
    private readonly repo: PostRepo,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(
    query: GetPostsQuery,
  ): Promise<Result<CursorPagination<PostSummary>, AppError>> {
    const postListRes = await this.repo.listPost(
      query.size,
      query.preId,
      query.categoryId,
    );
    if (isErr(postListRes)) {
      return postListRes;
    }
    const posts = postListRes.value.posts;
    const postSummary: PostSummary[] = [];
    const authorSummaryCache = new Map<string, AuthorSummary>();
    for (const post of posts) {
      const authorId = post.authorId;
      let authorSummary: AuthorSummary | null = null;
      if (authorSummaryCache.has(authorId)) {
        authorSummary = authorSummaryCache.get(authorId)!;
      } else {
        const account = await this.queryBus.execute(
          new FindProfileByAccountIDQuery(authorId),
        );
        authorSummary = isErr(account)
          ? new AuthorSummary(authorId, authorId)
          : new AuthorSummary(
              account.value.id,
              account.value.nick,
              account.value.avatar,
            );
        authorSummaryCache.set(authorId, authorSummary);
      }
      postSummary.push(
        new PostSummary(
          post.id,
          post.title,
          post.threads[0]?.content ?? '',
          authorSummary,
          post.createdAt,
        ),
      );
    }
    return ok(
      new CursorPagination(
        postListRes.value.cursor,
        postSummary,
        postListRes.value.total,
      ),
    );
  }
}
