import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHidePostProposalRequest {
  @IsString()
  @IsNotEmpty()
  id: string;
  @IsString()
  @IsNotEmpty()
  reason: string;
}
