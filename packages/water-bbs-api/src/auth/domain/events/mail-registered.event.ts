import { IEvent } from '@nestjs/cqrs';

export class MailRegisteredEvent implements IEvent {
  id = 'auth.mail-registered';
  constructor(public readonly mail: string) {}
}
