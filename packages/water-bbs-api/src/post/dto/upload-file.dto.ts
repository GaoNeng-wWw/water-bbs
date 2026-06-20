import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class UploadFileResponse {
  @ApiProperty()
  @Expose()
  urls: string;
}

export class UploadFileRequest {
  @ApiProperty({ type: () => Array, format: 'binary' })
  file: any;
  @ApiProperty()
  @IsNumber()
  cost: number;
  @ApiProperty()
  @IsString()
  threadId: string;
}
