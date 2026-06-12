import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepo } from '../post.repo';
import { CreatePostResponse } from '../dto/create-post.dto';
import { DomainError, isOk, ok, Result } from 'water-bbs-shared';

export class CreatePostCommand extends Command<
  Result<CreatePostResponse, DomainError>
> {
  constructor(
    public readonly categoryId: string,
    public readonly title: string,
    public readonly content: string,
    public readonly actor: string,
  ) {
    super();
  }
}

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler implements ICommandHandler<CreatePostCommand> {
  constructor(private readonly repo: PostRepo) {}
  async execute(
    command: CreatePostCommand,
  ): Promise<Result<CreatePostResponse, DomainError>> {
    const post = await this.repo.createPost(
      command.categoryId,
      command.title,
      command.content,
      command.actor,
    );
    if (isOk(post)) {
      return ok(new CreatePostResponse(post.value.id));
    }
    return post;
  }
}
