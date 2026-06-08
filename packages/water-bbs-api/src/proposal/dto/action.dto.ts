import { IAction } from '@app/workflow';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class Action implements IAction {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public type: string;
  @IsObject()
  @ApiProperty()
  public args: Record<string, any>;
  @IsArray({ each: true })
  @ApiProperty({
    type: [Action],
    default: [],
    nullable: false,
    required: false,
  })
  public children: Action[] = [];
}
