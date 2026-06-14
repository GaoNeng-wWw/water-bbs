import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepo } from '../post.repo';
import { HiddenPostResponse } from '../dto/hidden-post.dto';
import { PostNotFound } from '../errors';
import { DomainError, err, isErr, isOk, ok, Result } from 'water-bbs-shared';
import { isEmpty } from 'class-validator';

export class HidePostCommand extends Command<
  Result<HiddenPostResponse, DomainError>
> {
  constructor(
    public readonly postId: string,
    public readonly hideReason: string,
    public readonly due: Date = new Date(),
    public readonly permanent: boolean = false,
  ) {
    super();
  }
}

@CommandHandler(HidePostCommand)
export class HidePostCommandHandler implements ICommandHandler<HidePostCommand> {
  constructor(private readonly repo: PostRepo) {}
  async execute(
    command: HidePostCommand,
  ): Promise<Result<HiddenPostResponse, DomainError>> {
    const postRes = await this.repo.findById(command.postId);
    if (isErr(postRes)) {
      return postRes;
    }
    const post = postRes.value;
    if (!post || isEmpty(post)) {
      return err(new PostNotFound());
    }
    post.hide(command.hideReason, command.due, command.permanent);
    const hidePostRes = await this.repo.updatePost(post);
    if (isOk(hidePostRes)) {
      return ok(new HiddenPostResponse(post.id));
    }
    return hidePostRes;
  }
}
