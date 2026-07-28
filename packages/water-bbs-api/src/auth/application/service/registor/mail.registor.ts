import { DomainError } from '@app/shared';
import { ok, Result } from 'neverthrow';
import { Credential, Identifier } from 'src/auth/entites';
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
  async execute(
    props: RegistorProps,
  ): Promise<Result<Identifier, DomainError>> {
    const ident = this.em.create(Identifier, {
      identType: props.identType,
      identValue: props.identValue,
      verified: false,
    });
    const cert = this.em.create(Credential, {
      credentialType: props.certType,
      credentialValue: props.certValue,
      identifier: ident,
    });
    this.em.persist(ident).persist(cert);
    await this.em.flush();
    setImmediate(() => {
      this.eventBus.publish(new MailRegisteredEvent(props.identValue));
    });
    return ok(ident);
  }
}
