import { Injectable } from '@nestjs/common';
import { NotificationProvider } from './notification.provider';
import { Result } from 'neverthrow';
import { DomainError } from '@app/shared';

export enum NotificationScene {
  REGISTER = 'REGISTER',
  RESET_PASSWORD = 'RESET_PASSWORD',
  LOGIN_ALERT = 'LOGIN_ALERT',
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  WECHAT = 'wechat',
  PUSH = 'push',
}

export type NotificationReceiver = {
  channel: NotificationChannel;
  value: string;
};

export type NotificationTemplate = {
  name: string;
};

export type NotificationData = Record<string, unknown>;

export type NotificationContext = {
  scene: NotificationScene;
  receivers: NotificationReceiver[];
  data: NotificationData;
  template?: NotificationTemplate;
};

@Injectable()
export class NotificationService {
  constructor(private readonly providers: NotificationProvider[]) {}
  notice(ctx: NotificationContext) {
    const tasks: Promise<Result<boolean, DomainError>>[] = [];
    for (const r of ctx.receivers) {
      const provider = this.providers.find((p) => p.support(r.channel));
      if (!provider) {
        continue;
      }
      tasks.push(
        provider.execute({
          reciver: r.value,
          scene: ctx.scene,
          data: ctx.data,
        }),
      );
    }
    return Promise.all(tasks);
  }
}
