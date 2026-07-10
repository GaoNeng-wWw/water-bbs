import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class RemoveTaskRequest {
  @ApiProperty()
  @IsString()
  id: string;
}

export class RemoveTaskResponse {
  @ApiProperty()
  @Expose()
  id: string;
  constructor(props: RemoveTaskResponse){
    Object.assign(this, props);
  }
}
