import { SetMetadata } from '@nestjs/common';

export const RoleKey = Symbol('Role');

export const Role = (role: string) => SetMetadata(RoleKey, role);
