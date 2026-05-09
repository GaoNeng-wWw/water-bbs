import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator((_, ctx) => {
  const req: Request = ctx.switchToHttp().getRequest();
  return req.user;
});
