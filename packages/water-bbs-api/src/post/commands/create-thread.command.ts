import {
  Command,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { PostRepo } from '../post.repo';
import { FindProfileByAccountIDQuery } from '../../account/application/queries';
import { PostNotFound } from '../errors';
import { CreateThreadResponse } from '../dto/create-thread.dto';
import { Thread, ThreadAuthorSummary } from '../entities/thread';
import { Thread as ThreadAR } from 'water-bbs-migration';
import { DomainError, err, isErr, ok, Result } from 'water-bbs-shared';

export class CreateThreadCommand extends Command<
  Result<CreateThreadResponse, DomainError>
> {
  constructor(
    public readonly postId: string,
    public readonly threadContent: string,
    public readonly authorId: string,
  ) {
    super();
  }
}

@CommandHandler(CreateThreadCommand)
export class CreateThreadCommandHandler implements ICommandHandler<CreateThreadCommand> {
  constructor(
    private readonly repo: PostRepo,
    private readonly query: QueryBus,
  ) {}
  async execute(
    command: CreateThreadCommand,
  ): Promise<Result<CreateThreadResponse, DomainError>> {
    const postRes = await this.repo.findById(command.postId);
    if (isErr(postRes)) {
      return postRes;
    }
    const post = postRes.value;
    if (!post) {
      return err(new PostNotFound());
    }
    const authorRes = await this.query.execute(
      new FindProfileByAccountIDQuery(command.authorId),
    );
    if (isErr(authorRes)) {
      return authorRes;
    }
    const threadAr = new ThreadAR(
      command.threadContent,
      command.authorId,
      post,
    );
    post.appendThread(threadAr);
    const updateResult = await this.repo.createThread(threadAr, post);
    if (isErr(updateResult)) {
      return updateResult;
    }
    const thread = new Thread(
      threadAr.id,
      new ThreadAuthorSummary(
        command.authorId,
        authorRes.value.nick,
        authorRes.value.bio,
        authorRes.value.avatar,
      ),
      threadAr.content,
      threadAr.createdAt.toLocaleDateString(),
      threadAr.floor,
    );
    return ok(new CreateThreadResponse(command.postId, thread));
  }
}
