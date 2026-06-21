import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { DomainError, err, isErr, isOk, ok, Result } from 'water-bbs-shared';
import { AccountID } from '../../domain';
import {
  type IAccountRepoistory,
  InjectAccountRepository,
} from '../../domain/repo/account.repo';
import { AccountNotFound } from '../errors/account-not-found';
import { GetProfileDTO } from '../../domain/dto/get-profile.dto';
import { InjectUrlResolver, type Resolver } from '@app/storage';

export class GetProfileQuery extends Query<Result<GetProfileDTO, DomainError>> {
  constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(GetProfileQuery)
export class GetProfileQueryHandler implements IQueryHandler<GetProfileQuery> {
  constructor(
    @InjectAccountRepository()
    private accountRepository: IAccountRepoistory,
    @InjectUrlResolver()
    private readonly fileUrlResolver: Resolver,
  ) {}

  async execute(
    query: GetProfileQuery,
  ): Promise<Result<GetProfileDTO, DomainError>> {
    const accountId = new AccountID({ value: query.id });
    const res = await this.accountRepository.findOne(accountId);
    if (isErr(res)) {
      return res;
    }
    const account = res.value;
    if (!account) {
      return err(new AccountNotFound());
    }
    const profile = account.profile;
    const avatarUrl = profile.avatar
      ? await this.fileUrlResolver.getUrl(profile.avatar)
      : ok('');
    return ok(
      new GetProfileDTO(
        account.id,
        profile.name,
        profile.bio,
        isOk(avatarUrl) ? avatarUrl.value : '',
      ),
    );
  }
}
