import { DomainError } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { Data, render } from 'ejs';
import { existsSync, readFileSync } from 'fs';
import { err, ok, Result } from 'neverthrow';
import { join } from 'path';
import { NotFoundTemplate, TemplateCanNotOpen } from './error';
import { NotificationChannel } from './notification.service';

@Injectable()
export class NotificationTemplateResolver {
  private readonly templateMap = new Map<string, string>();
  constructor() {}
  resolve(
    channel: NotificationChannel,
    name?: string,
    data: Data = {},
  ): Result<string, DomainError> {
    if (!name) {
      return this.resolve(channel, channel, data);
    }
    const template = this.templateMap.get(`${name}.${channel}`);
    if (template) {
      return ok(render(template, data));
    }
    if (!existsSync(join(__dirname, 'templates', `${name}.${channel}.ejs`))) {
      return err(new NotFoundTemplate());
    }
    try {
      const fileContent = readFileSync(
        join(__dirname, 'templates', `${name}.${channel}.ejs`),
      ).toString();
      if (fileContent) {
        this.templateMap.set(`${name}.${channel}`, fileContent);
      }
      return ok(render(fileContent, data));
    } catch {
      return err(new TemplateCanNotOpen());
    }
  }
}
