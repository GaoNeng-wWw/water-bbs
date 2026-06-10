import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UploadImageRequest {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class UploadImageResponse {
  @Expose()
  @ApiProperty()
  url: string;
}
