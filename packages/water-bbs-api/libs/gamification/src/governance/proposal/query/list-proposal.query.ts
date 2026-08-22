import { IQueryHandler, Query } from '@nestjs/cqrs';
import { Proposal, ProposalStatus } from '../proposal.entity';
import { DomainError } from '@app/shared';
import { EntityRepository } from '@mikro-orm/sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ok, Result } from 'neverthrow';

export type ListProposalItem = {
  id: string;
  title: string;
  status: ProposalStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type ListProposalResponse = {
  items: ListProposalItem[];
  nextCursor: string | null;
};

export class ListProposal extends Query<
  Result<ListProposalResponse, DomainError>
> {
  constructor(
    public readonly size: number = 10,
    public readonly cursor?: string,
  ) {
    super();
  }
}

export class ListProposalService implements IQueryHandler<ListProposal> {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepository: EntityRepository<Proposal>,
  ) {}
  async execute({
    cursor,
    size,
  }: ListProposal): Promise<Result<ListProposalResponse, DomainError>> {
    const items = await this.proposalRepository.findByCursor({
      after: cursor,
      first: size,
    });
    return ok({
      items: items.items.map((item) => ({
        id: item.id.toString(),
        title: item.title,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      nextCursor: items.endCursor,
    });
  }
}
