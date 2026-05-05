import {
  ISender,
  MailMessage,
  SenderError,
} from '@app/shared/application/port';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { err, ok, Result } from 'water-bbs-shared';

@Injectable()
export class MailSender implements ISender<MailMessage> {
  constructor(private readonly mailerService: MailerService) {}
  send(message: MailMessage): Promise<Result<boolean, SenderError>> {
    return this.mailerService
      .sendMail({
        from: message.from,
        to: message.to,
        subject: message.title,
        html: message.content,
      })
      .then(() => ok(true))
      .catch((reason) => err(new SenderError(reason)));
  }
}
