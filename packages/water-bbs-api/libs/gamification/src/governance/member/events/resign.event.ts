import { IEvent } from '@nestjs/cqrs';
import { AccountId } from 'src/auth';

/**
 * @description 主动卸任事件
 */
export class Resign implements IEvent {
  id = 'gamification.governance.member.resign';
  constructor(
    public readonly accountId: AccountId,
    public readonly time: Date = new Date(),
  ) {}
}
