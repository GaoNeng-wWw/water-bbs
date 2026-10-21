import z, { core } from 'zod';
import { localCode } from './local-code';
import { $ZodCheckRegexParams } from 'zod/v4/core';

export const localMap = (
  localCodeParam?: string | $ZodCheckRegexParams,
  params?: string | core.$ZodRecordParams,
) => z.record(localCode(localCodeParam), z.string(), params);
