import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Expose } from 'class-transformer';

export class UnlockedStateDto {
  @ApiProperty({ enum: [true] })
  @Expose()
  unlocked = true as const;

  @ApiProperty({ example: 'https://example.com/resource' })
  @Expose()
  url: string;

  @ApiProperty()
  @Expose()
  fileName: string;

  @ApiProperty()
  @Expose()
  mimeType: string;
}

export class LockedStateDto {
  @ApiProperty({ enum: [false] })
  @Expose()
  unlocked = false as const;

  @ApiProperty({ example: 10 })
  @Expose()
  cost: number;

  @ApiProperty()
  @Expose()
  fileName: string;

  @ApiProperty()
  @Expose()
  mimeType: string;
}

@ApiExtraModels(UnlockedStateDto, LockedStateDto)
export class ListResourceResponse {
  @Type(() => UnlockedStateDto, {
    discriminator: {
      property: 'unlocked',
      subTypes: [
        { value: UnlockedStateDto, name: 'true' },
        { value: LockedStateDto, name: 'false' },
      ],
    },
  })
  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(UnlockedStateDto) },
        { $ref: getSchemaPath(LockedStateDto) },
      ],
      discriminator: {
        propertyName: 'unlocked',
        mapping: {
          true: getSchemaPath(UnlockedStateDto),
          false: getSchemaPath(LockedStateDto),
        },
      },
    },
  })
  resources: (LockedStateDto | UnlockedStateDto)[];
}
