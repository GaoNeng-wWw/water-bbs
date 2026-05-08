import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const Token = createParamDecorator((data, ctx) => {
  const http = ctx.switchToHttp();
  const req: Request = http.getRequest();
  const authorization = req.headers.authorization ?? '';
  const [, token] = authorization.split(' ');
  return token;
});
