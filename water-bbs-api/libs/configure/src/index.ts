import Joi from 'joi';
import { yaml } from './loader';
import {
  DatabaseConfigure,
  databaseConfigValidatorSchema,
} from './configure/database.configure';

export type Configure = {
  database: DatabaseConfigure;
};

export const configureSchema = Joi.object<Configure>({
  database: databaseConfigValidatorSchema,
});

export { yaml };
