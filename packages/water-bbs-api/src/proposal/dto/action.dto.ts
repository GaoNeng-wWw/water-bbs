import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class Action {
  @IsNotEmpty()
  @IsString()
  public type: string;
  @IsObject()
  public args: Record<string, any>;
  @IsArray({ each: true })
  public children: Action[];
}
