import { ApiProperty } from '@nestjs/swagger';

export const FieldEnum = [
  'user.id',
  'user.nick',
  'user.avatar',
  'user.bio',
  'user.created_at',
  'user.governance.admin.is',
  'user.governance.admin.was',
  'user.governance.bd.is',
  'user.governance.bd.was',
  'event.type',
  'time.now.hour',
  'time.now.weekday',
  'time.now.day',
  'time.now.month',
  'time.now.year',
] as const;

export const OperatorEnum = [
  'lt',
  'lte',
  'eq',
  'neq',
  'gt',
  'gte',
  'in',
  'not_in',
] as const;

export class WhenExpressionDto {
  @ApiProperty({ type: String, description: '条件表达式唯一标识' })
  id: string;

  @ApiProperty({
    enum: FieldEnum,
    description: '字段名',
  })
  field: string;

  @ApiProperty({
    enum: OperatorEnum,
    description: '比较运算符',
  })
  operator: string;

  @ApiProperty({
    description: '目标值',
  })
  goal: any;

  @ApiProperty({
    description: '条件描述',
  })
  desc?: Record<string, string>;
}

export class WhenNodeDto {
  @ApiProperty({
    oneOf: [
      { $ref: '#/components/schemas/WhenAllDto' },
      { $ref: '#/components/schemas/WhenAnyDto' },
      { $ref: '#/components/schemas/WhenNotDto' },
      { $ref: '#/components/schemas/WhenExpressionDto' },
    ],
    description: '条件节点：all/any/not 逻辑组合或叶子表达式',
  })
  node: WhenAllDto | WhenAnyDto | WhenNotDto | WhenExpressionDto;
}

export class WhenAllDto {
  @ApiProperty({
    type: [WhenNodeDto],
    description: '所有子条件必须满足 (AND)',
  })
  all: WhenNodeDto[];
}

export class WhenAnyDto {
  @ApiProperty({
    type: [WhenNodeDto],
    description: '任一子条件满足即可 (OR)',
  })
  any: WhenNodeDto[];
}

export class WhenNotDto {
  @ApiProperty({
    type: [WhenNodeDto],
    description: '子条件取反 (NOT)',
  })
  not: WhenNodeDto[];
}

export class TopWhenAllDto {
  @ApiProperty({
    type: [WhenNodeDto],
    description: '所有子条件必须满足 (AND)',
  })
  all: WhenNodeDto[];
}

export class TopWhenAnyDto {
  @ApiProperty({
    type: [WhenNodeDto],
    description: '任一子条件满足即可 (OR)',
  })
  any: WhenNodeDto[];
}

export class TopWhenNotDto {
  @ApiProperty({
    type: [WhenNodeDto],
    description: '子条件取反 (NOT)',
  })
  not: WhenNodeDto[];
}
