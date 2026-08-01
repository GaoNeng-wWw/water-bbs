import { ApiProperty } from '@nestjs/swagger';
import type { AccountId } from '../../auth';

export class ProfileInfo {
  @ApiProperty({ description: '用户ID' })
  id: AccountId;
  @ApiProperty({ description: '昵称' })
  nick: string;
  @ApiProperty({ description: '个人简介', required: false })
  bio?: string;
}
