import { IsNotEmpty, IsString } from 'class-validator';

export class HiddenPostDTO {
  @IsNotEmpty()
  @IsString()
  reason: string;
}

export class HiddenPostResponse {
  @IsNotEmpty()
  @IsString()
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}
