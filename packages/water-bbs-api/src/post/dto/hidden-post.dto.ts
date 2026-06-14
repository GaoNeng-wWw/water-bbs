import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class HiddenPostDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reason: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  due: Date;
}

export class HiddenPostResponse {
  @IsNotEmpty()
  @IsString()
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}
