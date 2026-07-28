import { Result } from 'neverthrow';
import {
  NotificationChannel,
  NotificationData,
  NotificationScene,
  NotificationTemplate,
} from './notification.service';
import { DomainError } from '@app/shared';

export type ProviderExcuteProps = {
  scene: NotificationScene;
  data: NotificationData;
  template?: NotificationTemplate;
  reciver: string;
};

export abstract class NotificationProvider {
  abstract support(channel: NotificationChannel): boolean;
  abstract execute(
    context: ProviderExcuteProps,
  ): Promise<Result<boolean, DomainError>>;
}
