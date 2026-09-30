import {
  UiCheckboxDto,
  UiDatePickerDto,
  UiInputDto,
  uiSchema,
  UiSelectDto,
} from '@app/engine';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import z from 'zod';

@ApiExtraModels(UiInputDto, UiSelectDto, UiCheckboxDto, UiDatePickerDto)
export class StepInfo {
  @ApiProperty({ type: 'string' })
  key: string;
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(UiInputDto) },
      { $ref: getSchemaPath(UiSelectDto) },
      { $ref: getSchemaPath(UiCheckboxDto) },
      { $ref: getSchemaPath(UiDatePickerDto) },
    ],
    discriminator: {
      propertyName: 'type',
      mapping: {
        input: getSchemaPath(UiInputDto),
        select: getSchemaPath(UiSelectDto),
        checkbox: getSchemaPath(UiCheckboxDto),
        'date-picker': getSchemaPath(UiDatePickerDto),
      },
    },
    isArray: true,
  })
  ui: z.infer<typeof uiSchema>;
  @ApiProperty({ type: 'object', additionalProperties: {} })
  param: Record<string, any>;
}
