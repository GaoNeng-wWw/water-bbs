import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class PaginationQuery {
  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: '页码', default: 1 })
  public readonly page: number = 1;
  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: '每页数量', default: 10 })
  public readonly size: number = 10;
}

export class PaginationData<T> {
  @ApiProperty({ description: '数据列表' })
  public data: T[];

  @ApiProperty({ description: '总条数', default: 0 })
  public total: number = 0;

  constructor(data: T[], total: number) {
    this.data = data;
    this.total = total;
  }
}

export const ApiPaginationResponse = <TModel extends Type<any>>(
  model: TModel,
) =>
  applyDecorators(
    ApiExtraModels(PaginationData, model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(PaginationData),
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
