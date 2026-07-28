import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MailRegisteredEvent } from '../../domain';
import { VerificationCodeService } from '@app/verification-code';
import {
  NotificationChannel,
  NotificationScene,
  NotificationService,
} from '@app/notification';

@EventsHandler(MailRegisteredEvent)
export class SendVerificationEmailService implements IEventHandler<MailRegisteredEvent> {
  constructor(
    private verification: VerificationCodeService,
    private notification: NotificationService,
  ) {}
  async handle(event: MailRegisteredEvent) {
    const codeResult = await this.verification.issue({
      scene: 'register',
      receiver: event.mail,
    });
    if (codeResult.isErr()) {
      return codeResult;
    }
    const code = codeResult.value;
    const notifyResult = await this.notification.notify({
      scene: NotificationScene.REGISTER,
      receivers: [{ channel: NotificationChannel.EMAIL, value: event.mail }],
      data: { code },
    });
    return notifyResult;
  }
}
