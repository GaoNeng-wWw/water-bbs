import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import {
  CreateCategoryService,
  RecoverCategoryService,
  RemoveCategoryService,
  UpdateCategoryService,
} from './command';
import {
  FindCategoryService,
  GetCategoryTotalService,
  ListCategoryService,
} from './query';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Category } from './entities';
import { OnCategoryCreated } from './event-handler';

@Module({
  imports: [MikroOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CreateCategoryService,
    RecoverCategoryService,
    RemoveCategoryService,
    UpdateCategoryService,
    FindCategoryService,
    ListCategoryService,
    GetCategoryTotalService,
    OnCategoryCreated,
  ],
})
export class CategoryModule {}
