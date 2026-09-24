import {
  GetAccountGovernanceMember,
  GetAccountGovernanceMemberList,
} from '@app/gamification';
import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AccountId } from 'src/auth';

@Injectable()
export class BdService {
  constructor(private readonly qb: QueryBus) {}
  async getBdRecord(accountId: AccountId) {
    const bdRecordResult = await this.qb.execute(
      new GetAccountGovernanceMember(accountId),
    );
    if (bdRecordResult.isErr()) {
      return bdRecordResult;
    }
    return bdRecordResult.value;
  }
  async getBdRecordList(accountId: AccountId) {
    const bdRecordResult = await this.qb.execute(
      new GetAccountGovernanceMemberList(accountId),
    );
    return bdRecordResult;
  }
}
