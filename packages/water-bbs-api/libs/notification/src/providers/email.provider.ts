import { DomainError } from '@app/shared';
import { err, ok, Result } from 'neverthrow';
import {
  NotificationProvider,
  ProviderExcuteProps,
} from '../notification.provider';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { NotificationTemplateResolver } from '../notification-template.resolver';
import { NotificationChannel } from '../notification.service';

@Injectable()
export class EmailProvider extends NotificationProvider {
  constructor(
    private readonly mail: MailerService,
    private readonly templateResolver: NotificationTemplateResolver,
  ) {
    super();
  }
  support(channel: NotificationChannel): boolean {
    return channel === NotificationChannel.EMAIL;
  }
  execute(context: ProviderExcuteProps): Promise<Result<boolean, DomainError>> {
    const template = this.templateResolver.resolve(
      NotificationChannel.EMAIL,
      context.template?.name,
      context.data,
    );
    return this.mail
      .sendMail({
        template: template.isOk()
          ? template.value
          : (context.scene.toString() ?? ''),
        context: context.data,
      })
      .then(() => ok(true))
      .catch((reason) => err(reason));
  }
}
