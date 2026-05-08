import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_FLAG = Symbol('IS_PUBLIC_FLAG');

export const isPublic = () => SetMetadata(IS_PUBLIC_FLAG, true);
