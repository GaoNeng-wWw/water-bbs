import { Injectable } from '@nestjs/common';
import { PostRepo } from './post.repo';
import { err, isErr, isOk, ok } from 'water-bbs-shared';
import { QueryBus } from '@nestjs/cqrs';
import { FindProfileByAccountIDQuery } from '../account/queries';
import { AuthorSummary, PostSummary } from './entities/post-summary';
import { CursorPagination, Pagination } from '@app/shared';
import { HiddenPostResponse } from './dto/hidden-post.dto';
import { CreatePostResponse } from './dto/create-post.dto';
import { PostNotFound } from './errors';
import { Thread, ThreadAuthorSummary } from './entities/thread';

@Injectable()
export class PostApplicationService {
  constructor(
    private repo: PostRepo,
    private query: QueryBus,
  ) {}

  async createPost(
    categoryId: string,
    title: string,
    content: string,
    actor: string,
  ) {
    const post = await this.repo.createPost(categoryId, title, content, actor);
    if (isOk(post)) {
      return new CreatePostResponse(post.value.id);
    }
    return post;
  }

  async hidePost(postId: string, hideReason: string) {
    const postRes = await this.repo.findById(postId);
    if (isErr(postRes)) {
      return postRes;
    }
    const post = postRes.value;
    if (!post) {
      return err(new PostNotFound());
    }
    post.hide(hideReason);
    const hidePostRes = await this.repo.updatePost(post);
    if (isOk(hidePostRes)) {
      return new HiddenPostResponse(hidePostRes.value.id);
    }
    return hidePostRes;
  }

  async getPostSummary(id: string) {
    const postRes = await this.repo.findById(id);
    if (isErr(postRes)) {
      return postRes;
    }
    const post = postRes.value;
    if (!post) {
      return err(new PostNotFound());
    }
    const findProfileResult = await this.query.execute(
      new FindProfileByAccountIDQuery(post.authorId),
    );
    if (isErr(findProfileResult)) {
      return findProfileResult;
    }
    const profile = findProfileResult.value;
    const authorSummary = new AuthorSummary(
      profile.id,
      profile.nick,
      profile.avatar,
    );
    return new PostSummary(
      post.id,
      post.title,
      post.threads[0].content,
      authorSummary,
      post.createdAt,
    );
  }

  async getPosts(size: number, preId?: string, categoryId?: string) {
    const postListRes = await this.repo.listPost(size, preId, categoryId);
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
        const account = await this.query.execute(
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
    return new CursorPagination(
      postListRes.value.cursor,
      postSummary,
      postListRes.value.total,
    );
  }
  async getThread(postId: string, page: number = 1, limit: number = 10) {
    const threadsResult = await this.repo.getThreads(postId, page, limit);
    if (isErr(threadsResult)) {
      return threadsResult;
    }
    const payload = threadsResult.value;
    const threads = payload.threads;
    const authorSummaryCache = new Map();
    const resThreads: Thread[] = [];
    for (const thread of threads) {
      const authorId = thread.authorId;
      const authorRes = await this.query.execute(
        new FindProfileByAccountIDQuery(authorId),
      );
      if (isErr(authorRes)) {
        return authorRes;
      }
      const authorValue = authorRes.value;
      const author = new ThreadAuthorSummary(
        authorValue.id,
        authorValue.nick,
        authorValue.bio,
        authorValue.avatar,
      );
      authorSummaryCache.set(authorValue.id, author);
      resThreads.push(
        new Thread(
          thread.id,
          author,
          thread.content,
          thread.createdAt.toLocaleDateString(),
        ),
      );
    }
    return ok(new Pagination(payload.total, resThreads));
  }
}
