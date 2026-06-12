import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from './commands/create-post.command';
import { HidePostCommand } from './commands/hide-post.command';
import { UploadImageCommand } from './commands/upload-image.command';
import { CreateThreadCommand } from './commands/create-thread.command';
import { GetPostSummaryQuery } from './queries/get-post-summary.query';
import { GetPostsQuery } from './queries/get-posts.query';
import { GetThreadQuery } from './queries/get-thread.query';

@Injectable()
export class PostApplicationService {
  constructor(
    private query: QueryBus,
    private commandBus: CommandBus,
  ) {}

  async createPost(
    categoryId: string,
    title: string,
    content: string,
    actor: string,
  ) {
    return this.commandBus.execute(
      new CreatePostCommand(categoryId, title, content, actor),
    );
  }

  async hidePost(postId: string, hideReason: string) {
    return this.commandBus.execute(new HidePostCommand(postId, hideReason));
  }

  async getPostSummary(id: string) {
    return this.query.execute(new GetPostSummaryQuery(id));
  }

  async getPosts(size: number, preId?: string, categoryId?: string) {
    return this.query.execute(new GetPostsQuery(size, preId, categoryId));
  }
  async getThread(postId: string, page: number = 1, limit: number = 10) {
    return this.query.execute(new GetThreadQuery(postId, page, limit));
  }
  async uploadImage(file: Express.Multer.File) {
    return this.commandBus.execute(new UploadImageCommand(file));
  }
  async createThread(postId: string, threadContent: string, authorId: string) {
    return this.commandBus.execute(
      new CreateThreadCommand(postId, threadContent, authorId),
    );
  }
}
