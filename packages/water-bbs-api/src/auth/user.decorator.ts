import { createParamDecorator } from '@nestjs/common';
import { AuthRequest } from './auth.guard';

export type UserPath = 'id';

export const User = createParamDecorator((path: UserPath, ctx) => {
  const http = ctx.switchToHttp();
  const req: AuthRequest = http.getRequest();
  if (!req.user) {
    return null;
  }
  return req['user'][path];
});