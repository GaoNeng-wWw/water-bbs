import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepo } from './category.repo';
import { Category } from 'water-bbs-migration';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { FindCategoryQueryHandler, ListCategoriesQueryHandler } from './query';
import {
  CreateCategoryCommandHandler,
  UpdateCategoryCommandHandler,
  RemoveCategoryCommandHandler,
} from './command';

@Module({
  imports: [MikroOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [
    CategoryRepo,
    CategoryService,
    ListCategoriesQueryHandler,
    CreateCategoryCommandHandler,
    UpdateCategoryCommandHandler,
    RemoveCategoryCommandHandler,
    FindCategoryQueryHandler,
  ],
})
export class CategoryModule {}
