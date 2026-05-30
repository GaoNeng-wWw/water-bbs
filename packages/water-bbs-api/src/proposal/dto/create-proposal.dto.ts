import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Action } from './action.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateProposal {
  @IsNotEmpty()
  @IsString()
  public content: string;
  @ApiProperty()
  @IsObject({ each: true })
  @ApiProperty()
  public workflows: Action;
}

export class CreateProposalResponse {
  @ApiProperty()
  @Expose()
  public id: string;
}
