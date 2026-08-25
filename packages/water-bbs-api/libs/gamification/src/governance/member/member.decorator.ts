import { SetMetadata } from '@nestjs/common';
import { MemberKind } from './member.entity';

export const MEMBER_KEY = Symbol('member');

export const Member = (kind: MemberKind) => SetMetadata(MEMBER_KEY, kind);
