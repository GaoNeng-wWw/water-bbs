import { EntityRepository } from '@mikro-orm/mysql';
import { IQueryHandler, Query, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { ProposalComment } from 'water-bbs-migration';
import {
  AppError,
  DomainError,
  err,
  isErr,
  ok,
  Result,
} from 'water-bbs-shared';
import { ProposalRepository } from '../proposal.repo';
import { InjectRepository } from '@mikro-orm/nestjs';
import { isEmpty } from 'class-validator';
import { FindProfileBatchQuery } from 'src/account/application/queries';
import { CommentAuthor } from '../dto/list-proposal-comments.dto';
import { ProposalComment as ProposalCommentDto } from '../dto/list-proposal-comments.dto';

export class FindProposalCommentsQuery extends Query<
  Result<
    {
      data: ProposalCommentDto[];
      total: number;
    },
    AppError
  >
> {
  constructor(
    public readonly proposalId: string,
    public readonly page: number,
    public readonly size: number,
  ) {
    super();
  }
}

@QueryHandler(FindProposalCommentsQuery)
export class FindProposalComments implements IQueryHandler<FindProposalCommentsQuery> {
  constructor(
    @InjectRepository(ProposalComment)
    private readonly proposalCommentRepository: EntityRepository<ProposalComment>,
    private readonly proposalRepository: ProposalRepository,
    private readonly qb: QueryBus,
  ) {}
  async execute(query: FindProposalCommentsQuery) {
    const { proposalId, page, size } = query;

    const proposalResult =
      await this.proposalRepository.findProposal(proposalId);
    if (isErr(proposalResult)) {
      return proposalResult;
    }
    const proposal = proposalResult.value;
    if (isEmpty(proposal)) {
      return err(new DomainError('PROPOSAL_NOT_FOUND'));
    }
    const [comments, total] = await this.proposalCommentRepository.findAndCount(
      {
        proposalId: query.proposalId,
      },
      {
        offset: (page - 1) * size,
        limit: size,
        cache: true,
      },
    );
    if (!comments.length) {
      return ok({ data: [], total: 0 });
    }
    const accountIdList = comments.map((comment) => comment.accountId);
    const profileResult = await this.qb.execute(
      new FindProfileBatchQuery(accountIdList),
    );
    if (isErr(profileResult)) {
      return profileResult;
    }
    const authors: CommentAuthor[] = profileResult.value.map((account) => {
      const { id, profile } = account;
      return {
        id,
        avatar: profile?.avatar ?? '',
        nick: profile?.nick ?? '',
      };
    });
    const commentsReturn: ProposalCommentDto[] = comments.map(
      (comment, index) => {
        return {
          commentId: comment.id,
          content: comment.comment,
          author: authors[index],
          createdAt: comment.createdAt,
          action: comment.action,
        };
      },
    );
    return ok({ data: commentsReturn, total });
  }
}
