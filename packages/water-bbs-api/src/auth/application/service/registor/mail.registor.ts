import { DomainError } from '@app/shared';
import { ok, Result } from 'neverthrow';
import { Account } from '../../../entites';
import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { MailRegisteredEvent } from '../../../domain';
import { Registor, RegistorProps } from './registor.type';

@Injectable()
export class MailRegistor implements Registor {
  constructor(
    private readonly em: EntityManager,
    private readonly eventBus: EventBus,
  ) {}
  validate(identType: string): Promise<boolean> {
    return Promise.resolve(identType.toLowerCase().trim() === 'email');
  }
  async execute(props: RegistorProps): Promise<Result<Account, DomainError>> {
    props.account.addCredential(props.credentialType, props.credentialValue);
    props.account.addIdentifier(props.identType, props.identValue);
    await this.em.flush();
    setImmediate(() => {
      this.eventBus.publish(new MailRegisteredEvent(props.identValue));
    });
    return ok(props.account);
  }
}
