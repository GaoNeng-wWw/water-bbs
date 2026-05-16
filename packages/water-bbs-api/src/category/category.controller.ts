import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateCategoryDTO,
  CreateCategoryResponse,
} from './dto/create-category.dto';
import { CategorySummary } from './entities/category-summary.entry';
import { Permission, Public, UseModel } from '@app/shared';
import {
  UpdateCategoryDTO,
  UpdateCategoryResponse,
} from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Permission('category:create')
  @UseModel(CreateCategoryResponse)
  @ApiCreatedResponse({ type: CreateCategoryResponse })
  @Post('')
  async createCategory(@Body() dto: CreateCategoryDTO) {
    return this.categoryService.createCategory(dto.name, dto.parent);
  }

  @Permission('category:remove')
  @ApiOkResponse({ type: UpdateCategoryResponse })
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.removeCategory(id);
  }

  @Permission('category:update')
  @UseModel(UpdateCategoryResponse)
  @ApiOkResponse({ type: UpdateCategoryResponse })
  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDTO,
  ) {
    return this.categoryService.updateCategory(id, dto.name, dto.parent);
  }

  @Public()
  @ApiOkResponse({ type: [CategorySummary] })
  @ApiQuery({
    name: 'parent',
    description: 'Parent category ID',
    required: false,
  })
  @Get('')
  async listCategories(@Query('parent') parent?: string) {
    return this.categoryService.listCategories(parent);
  }
}
