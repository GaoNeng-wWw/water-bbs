import { PartialType } from '@nestjs/swagger';
import { CreateCategoryRequest } from './create-category.dto';

export class UpdateCategoryRequest extends PartialType(CreateCategoryRequest) {}
