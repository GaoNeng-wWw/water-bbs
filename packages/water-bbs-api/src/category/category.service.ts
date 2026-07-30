import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  FindCategoryQuery,
  GetCategoryTotalQuery,
  ListCategoryQuery,
} from './query';
import { PaginationData, PaginationQuery } from '@app/shared';
import { ok } from 'neverthrow';
import { CreateCategoryRequest } from './dto/create-category.dto';
import {
  CreateCategory,
  RecoverCategory,
  RemoveCategory,
  UpdateCategory,
} from './command';
import { CategoryId } from './entities';
import { UpdateCategoryRequest } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly qb: QueryBus,
    private readonly cb: CommandBus,
  ) {}
  async create(data: CreateCategoryRequest) {
    return this.cb.execute(new CreateCategory(data));
  }
  async remove(id: CategoryId) {
    const categoryInfo = await this.qb.execute(new FindCategoryQuery(id));
    if (categoryInfo.isErr()) {
      return categoryInfo;
    }
    const removedCategoryId = await this.cb.execute(new RemoveCategory(id));
    if (removedCategoryId.isErr()) {
      return removedCategoryId;
    }
    return { id: removedCategoryId.value };
  }
  async updateCategory(id: CategoryId, body: UpdateCategoryRequest) {
    return this.cb.execute(new UpdateCategory(id, body));
  }
  async recover(id: CategoryId) {
    const recoveredCategoryId = await this.cb.execute(new RecoverCategory(id));
    if (recoveredCategoryId.isErr()) {
      return recoveredCategoryId;
    }
    const categoryInfo = await this.qb.execute(new FindCategoryQuery(id));
    if (categoryInfo.isErr()) {
      return categoryInfo;
    }
    return categoryInfo;
  }
  async find(id: CategoryId) {
    return this.qb.execute(new FindCategoryQuery(id));
  }
  async list(query: PaginationQuery) {
    const categories = await this.qb.execute(new ListCategoryQuery(query));
    const total = await this.qb.execute(new GetCategoryTotalQuery());
    if (total.isErr()) {
      return total;
    }
    return ok(new PaginationData(categories, total.value));
  }
}
