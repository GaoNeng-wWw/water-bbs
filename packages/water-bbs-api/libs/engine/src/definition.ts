import z from 'zod';
import { UIFieldSchema } from './schema';

export interface Definition<Param = any> {
  name: string;
  inputSchema: z.ZodType<Param>;
  uiSchema: UIFieldSchema;
  description?: string;
}
