import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ListTaskRequest {
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @ApiProperty()
  public page: number = 1;
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @ApiProperty()
  public size: number;
}

export class ListTaskItem {
  @ApiProperty()
  @Expose()
  id: string;
  @ApiProperty()
  @Expose()
  label: string;
  @ApiProperty()
  @Expose()
  description: string;
  @ApiProperty()
  @Expose()
  @Transform(({ value }: { value: Date }) => value.toDateString())
  createdAt: Date;
}

export class ListTaskResponse {
  @ApiProperty()
  @Expose()
  items: ListTaskItem[];
  @ApiProperty()
  @Expose()
  total: number;
}
