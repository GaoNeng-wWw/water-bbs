import z from 'zod';
import type { $ZodCheckRegexParams } from 'zod/v4/core';

export const localCode = (params?: string | $ZodCheckRegexParams) =>
  z.string().regex(/^[a-z]{2,3}(-[a-z0-9]{2,8})*$/i, params);