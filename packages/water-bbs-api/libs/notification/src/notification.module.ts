import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationTemplateResolver } from './notification-template.resolver';
import { EmailProvider } from './providers';
import { ConfigureModule, ConfigureService } from '@app/configure';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/adapters/ejs.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigureModule],
      inject: [ConfigureService],
      useFactory(configure) {
        const cfg = configure as ConfigureService;
        return {
          transport: {
            host: cfg.get('mail.host'),
            port: cfg.get('mail.port'),
            auth: cfg.get('mail.auth'),
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [NotificationService, NotificationTemplateResolver, EmailProvider],
  exports: [NotificationService],
})
export class NotificationModule {}
