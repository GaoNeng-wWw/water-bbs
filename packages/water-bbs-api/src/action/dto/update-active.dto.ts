import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateActive {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}

export class UpdateActiveResponse {
  @ApiProperty()
  @Expose()
  id: string;
}
