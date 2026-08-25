import { Loaded } from '@mikro-orm/core';
import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

type ICursorPagination<T> = {
  items: Loaded<T, never, never, never>[];
  nextCursor?: string | null;
  prevCursor?: string | null;
  total: number;
};

export class CursorDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '分页游标' })
  cursor?: string;
  @IsNumber()
  @ApiProperty({ description: '每页数量' })
  @Type(() => Number)
  size: number;
}

export class CursorPagination<T> {
  @ApiProperty({ description: '数据' })
  items: T[];
  @ApiProperty({ description: '下一页的分页' })
  nextCursor?: string | null;
  @ApiProperty({ description: '上一页的分页' })
  prevCursor?: string | null;
  @ApiProperty({ description: '总数' })
  total: number;
  constructor(props: ICursorPagination<T>) {
    Object.assign(this, props);
  }
}

export const ApiCursorPagination = <TModel extends Type<any>>(model: TModel) =>
  applyDecorators(
    ApiExtraModels(CursorPagination, model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(CursorPagination),
          },
          {
            properties: {
              data: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(model),
                },
              },
            },
          },
        ],
      },
    }),
  );
