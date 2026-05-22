import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class Pagination<T> {
  @Expose()
  @ApiProperty()
  public readonly total: number;

  @Expose()
  @ApiProperty()
  public readonly data: T[];

  constructor(total: number, data: T[]) {
    this.total = total;
    this.data = data;
  }
}

export function ApiPaginatedResponse<T extends Type>(dto: T) {
  return applyDecorators(
    ApiExtraModels(Pagination, dto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(Pagination) },
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
