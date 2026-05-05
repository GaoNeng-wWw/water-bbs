import { Result } from 'water-bbs-shared';
import { SenderError } from './sender.error';

export class Message {
  constructor(
    public from: string,
    public to: string,
    public content: string,
  ) {}
}

export class MailMessage extends Message {
  constructor(
    public from: string,
    public to: string,
    public content: string,
    public title: string,
  ) {
    super(from, to, content);
  }
}
export interface ISender<T extends Message> {
  send(message: T): Promise<Result<boolean, SenderError>>;
}
