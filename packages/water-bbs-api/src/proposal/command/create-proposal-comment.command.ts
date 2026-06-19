import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProposalComment } from 'water-bbs-migration';
import {
  AppError,
  DomainError,
  err,
  isErr,
  ok,
  PersistenceError,
  Result,
} from 'water-bbs-shared';
import { ProposalRepository } from '../proposal.repo';

export class CreateProposalCommentCommand extends Command<
  Result<
    {
      commentId: string;
    },
    AppError
  >
> {
  constructor(
    public readonly proposalId: string,
    public readonly content: string,
    public readonly authorId: string,
  ) {
    super();
  }
}

@CommandHandler(CreateProposalCommentCommand)
export class CreateProposalComment implements ICommandHandler<CreateProposalCommentCommand> {
  constructor(
    @InjectRepository(ProposalComment)
    private readonly proposalCommentRepository: EntityRepository<ProposalComment>,
    private readonly proposalRepository: ProposalRepository,
  ) {}
  async execute(
    command: CreateProposalCommentCommand,
  ): Promise<Result<{ commentId: string }, AppError>> {
    const findProposalResult = await this.proposalRepository.findProposal(
      command.proposalId,
    );
    if (isErr(findProposalResult)) {
      return findProposalResult;
    }
    const proposal = findProposalResult.value;
    if (!proposal) {
      return err(new DomainError('PROPOSAL_NOT_FOUND'));
    }
    const comment = ProposalComment.build(
      proposal.id,
      command.authorId,
      command.content,
    );
    return this.proposalCommentRepository
      .upsert(comment)
      .then((comment) => ok({ commentId: comment.id }))
      .catch((reason) => err(new PersistenceError(reason)));
  }
}
