import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ReportDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  reason: string;
  @IsNotEmpty()
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  proposalEndAt: string;
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  remove?: boolean;
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  emergency?: boolean;
}
