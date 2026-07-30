import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsHexColor, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryRequest {
  @ApiProperty({ description: '分类名称' })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiPropertyOptional({
    description: '分类颜色, 十六进制色彩值',
    example: '#FF0000',
  })
  @IsHexColor()
  color?: string;
  @ApiPropertyOptional({ description: '分类图标, 图标class' })
  @IsString()
  icon?: string;
  @ApiPropertyOptional({ description: '是否置顶', example: true })
  @IsBoolean()
  pin?: boolean;
}
