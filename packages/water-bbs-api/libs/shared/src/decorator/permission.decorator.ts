import { SetMetadata } from '@nestjs/common';

export const PERMISSION_METADATA_KEY = Symbol('PERMISSION');

export const Permission = (...permission: string[]) =>
  SetMetadata(PERMISSION_METADATA_KEY, permission);
