import { ApiProperty } from '@nestjs/swagger';
import { type CategoryId } from './category.entity';

export type CategoryInfoProps = {
  id: CategoryId;
  name: string;
  icon?: string;
  color?: string;
  createdAt: Date;
  pined: boolean;
};

export class CategoryInfo {
  @ApiProperty({ description: '分类ID', example: '123-4567890' })
  id: CategoryId;
  @ApiProperty({ description: '分类名称', example: '技术分类' })
  name: string;
  @ApiProperty({ description: '分类图标', example: 'icon-123' })
  icon?: string;
  @ApiProperty({ description: '分类颜色', example: '#000000' })
  color?: string;
  @ApiProperty({ description: '创建时间', example: '2023-01-01T00:00:00Z' })
  createdAt: string;
  @ApiProperty({ description: '是否置顶', example: true })
  pined: boolean;
  constructor({ id, name, icon, color, createdAt, pined }: CategoryInfo) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.color = color;
    this.createdAt = createdAt.toString();
    this.pined = pined;
  }
}
