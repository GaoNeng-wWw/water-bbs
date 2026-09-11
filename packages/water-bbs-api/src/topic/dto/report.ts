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
  reason: string;
  @IsNotEmpty()
  @IsNotEmpty()
  @IsDateString()
  proposalEndAt: string;
  @IsBoolean()
  @IsOptional()
  remove?: boolean;
  @IsBoolean()
  @IsOptional()
  emergency?: boolean;
}
