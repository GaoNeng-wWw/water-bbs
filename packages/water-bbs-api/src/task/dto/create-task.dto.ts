import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export enum PeriodUnit {
  Once = 'Once',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

export class TaskPeriod {
  @IsEnum(PeriodUnit)
  @ApiProperty({ enum: () => PeriodUnit })
  unit: PeriodUnit;
  @IsNumber()
  @ApiProperty()
  value: number;
}

export class CreateTaskRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  label: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;
  @ApiProperty({ type: Object })
  @IsNotEmptyObject()
  @IsObject()
  condition: Record<string, any>;
  @ApiProperty({ type: TaskPeriod })
  @IsNotEmptyObject()
  @IsObject()
  period: TaskPeriod;
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  rewardCodes: string[];
}
