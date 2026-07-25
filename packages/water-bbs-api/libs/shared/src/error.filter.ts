import { ArgumentsHost, ExceptionFilter, Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';
import { DomainError } from './error.base';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from './.generated/i18n.generated';

@Injectable()
export class ErrorFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService<I18nTranslations>) {}
  catch(exception: any, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const resp = http.getResponse<Response>();
    const req = http.getRequest<Request>();
    const lang = req.headers['accept-language'] || 'en-us';
    if (exception instanceof DomainError) {
      const { status, key, details, args } = exception;
      const translatedMessage = this.i18n.translate(key, { args, lang });
      resp.status(exception.status).json({
        statusCode: status,
        message: translatedMessage,
        details,
      });
    }
    return resp.status(500).json({
      statusCode: 500,
      message: this.i18n.translate('exception.INTERNAL_ERROR', { lang }),
    });
  }
}
