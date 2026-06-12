import { IQueryHandler, Query, QueryHandler, QueryBus } from '@nestjs/cqrs';
import { PostRepo } from '../post.repo';
import { FindProfileByAccountIDQuery } from '../../account/queries';
import { Thread, ThreadAuthorSummary } from '../entities/thread';
import { Pagination } from '@app/shared';
import { AppError, isErr, ok, Result } from 'water-bbs-shared';

export class GetThreadQuery extends Query<
  Result<Pagination<Thread>, AppError>
> {
  constructor(
    public readonly postId: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {
    super();
  }
}

@QueryHandler(GetThreadQuery)
export class GetThreadHandler implements IQueryHandler<GetThreadQuery> {
  constructor(
    private readonly repo: PostRepo,
    private readonly queryBus: QueryBus,
  ) {}
  async execute(
    query: GetThreadQuery,
  ): Promise<Result<Pagination<Thread>, AppError>> {
    const threadsResult = await this.repo.getThreads(
      query.postId,
      query.page,
      query.limit,
    );
    if (isErr(threadsResult)) {
      return threadsResult;
    }
    const payload = threadsResult.value;
    const resThreads: Thread[] = [];
    for (const thread of payload.threads) {
      const authorRes = await this.queryBus.execute(
        new FindProfileByAccountIDQuery(thread.authorId),
      );
      if (isErr(authorRes)) {
        return authorRes;
      }
      const author = new ThreadAuthorSummary(
        authorRes.value.id,
        authorRes.value.nick,
        authorRes.value.bio,
        authorRes.value.avatar,
      );
      resThreads.push(
        new Thread(
          thread.id,
          author,
          thread.content,
          thread.createdAt.toLocaleDateString(),
          thread.floor,
        ),
      );
    }
    return ok(new Pagination(payload.total, resThreads));
  }
}
