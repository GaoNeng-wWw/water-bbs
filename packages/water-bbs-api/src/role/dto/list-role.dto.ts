import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ListRole {
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  page: number;
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  size: number;
}

export class RoleSummary {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  code: string;
}
