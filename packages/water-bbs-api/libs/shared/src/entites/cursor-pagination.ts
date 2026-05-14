import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CursorPagination<T> {
  @ApiProperty()
  @Expose()
  public readonly cursor: string;

  @ApiProperty()
  @Expose()
  public readonly data: T[];

  @ApiProperty()
  @Expose()
  public readonly total: number;

  constructor(cursor: string, data: T[], total: number) {
    this.cursor = cursor;
    this.data = data;
    this.total = total;
  }
}

export function ApiCursorPaginatedResponse<T extends Type>(dto: T) {
  return applyDecorators(
    ApiExtraModels(CursorPagination, dto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(CursorPagination) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dto) },
              },
            },
          },
        ],
      },
    }),
  );
}
