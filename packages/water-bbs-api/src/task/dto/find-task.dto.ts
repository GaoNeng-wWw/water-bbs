import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class FindTaskRequest {
  @ApiProperty()
  @IsString()
  public readonly taskId: string;
}

export class FindTaskInfo {
  @Expose()
  @ApiProperty()
  id: string;
  @Expose()
  @ApiProperty()
  label: string;
  @Expose()
  @ApiProperty()
  description: string;
  @Expose()
  @ApiProperty()
  createdAt: Date;
  @Expose()
  @ApiProperty()
  once: boolean;
  @Expose()
  @ApiProperty()
  claimableAt?: Date;
  @Expose()
  @ApiProperty()
  canClaim: boolean;

  constructor(props: FindTaskInfo){
    Object.assign(this, props);
  }
}
