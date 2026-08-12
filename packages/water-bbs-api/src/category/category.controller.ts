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
import { CategoryInfo, type CategoryId } from './entities';
import { ApiPaginationResponse, PaginationQuery } from '@app/shared';
import { CreateCategoryRequest } from './dto/create-category.dto';
import { UpdateCategoryRequest } from './dto/update-category.dto';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { RemoveCategoryResponse } from './dto/remove-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: '获取分类列表', operationId: 'listCategory' })
  @ApiOkResponse({ description: '获取分类列表' })
  @ApiPaginationResponse(CategoryInfo)
  @Get()
  async list(@Query() query: PaginationQuery) {
    return this.categoryService.list(query);
  }

  @ApiOperation({ summary: '获取分类详情', operationId: 'findCategory' })
  @ApiOkResponse({ description: '获取分类详情', type: CategoryInfo })
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: '分类ID',
    example: '123-4567890',
    type: String,
  })
  async find(@Param('id') id: CategoryId) {
    return this.categoryService.find(id);
  }

  @ApiOperation({ summary: '创建分类', operationId: 'createCategory' })
  @ApiOkResponse({ description: '创建分类', type: CategoryInfo })
  @Post()
  async create(@Body() body: CreateCategoryRequest) {
    return this.categoryService.create(body);
  }

  @ApiOperation({ summary: '恢复分类', operationId: 'recoverCategory' })
  @ApiOkResponse({ description: '恢复分类', type: CategoryInfo })
  @Patch('recover/:id')
  @ApiParam({
    name: 'id',
    description: '分类ID',
    example: '123-4567890',
    type: String,
  })
  async recover(@Param('id') id: CategoryId) {
    return this.categoryService.recover(id);
  }

  @ApiOperation({ summary: '更新分类', operationId: 'updateCategory' })
  @ApiOkResponse({ description: '更新分类', type: CategoryInfo })
  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: '分类ID',
    example: '123-4567890',
    type: String,
  })
  update(@Param('id') id: CategoryId, @Body() body: UpdateCategoryRequest) {
    return this.categoryService.updateCategory(id, body);
  }

  @ApiOperation({ summary: '删除分类', operationId: 'removeCategory' })
  @ApiOkResponse({ description: '删除分类', type: RemoveCategoryResponse })
  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: '分类ID',
    example: '123-4567890',
    type: String,
  })
  async remove(@Param('id') id: CategoryId) {
    return this.categoryService.remove(id);
  }
}
