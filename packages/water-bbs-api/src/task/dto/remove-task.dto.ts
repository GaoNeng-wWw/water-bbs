import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RemoveTaskRequest {
  @ApiProperty()
  @IsString()
  id: string;
}

export class RemoveTaskResponse {
  @ApiProperty()
  @IsString()
  id: string;
  constructor(props: RemoveTaskResponse){
    Object.assign(this, props);
  }
}
