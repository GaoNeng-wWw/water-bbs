import { Injectable } from '@nestjs/common';
import { DomainError, err, isErr, ok } from 'water-bbs-shared';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateCategoryCommand,
  RemoveCategoryCommand,
  updateCategoryCommand,
} from './command';
import { FindCategoryQuery, ListCategories } from './query';

@Injectable()
export class CategoryService {
  constructor(
    private readonly cb: CommandBus,
    private readonly qb: QueryBus,
  ) {}
  async createCategory(name: string, parent?: string) {
    const res = await this.cb.execute(new CreateCategoryCommand(name, parent));
    if (isErr(res)) {
      return res;
    }
    const { id } = res.value;
    const findRes = await this.qb.execute(new FindCategoryQuery(id));
    if (isErr(findRes)) {
      return findRes;
    }
    const category = findRes.value!;
    return ok(category);
  }
  async removeCategory(id: string) {
    const cmd = new RemoveCategoryCommand(id);
    const res = await this.cb.execute(cmd);
    if (isErr(res)) {
      return res;
    }
    return ok(res.value);
  }
  async updateCategory(id: string, name?: string, parent?: string | null) {
    const cmd = new updateCategoryCommand(id, name, parent);
    const res = await this.cb.execute(cmd);
    if (isErr(res)) {
      return res;
    }
    if (!res.value) {
      return err(new DomainError('CATEGORY_NOT_FOUND'));
    }
    const category = new FindCategoryQuery(id);
    const findRes = await this.qb.execute(category);
    if (isErr(findRes)) {
      return findRes;
    }
    if (!findRes.value) {
      return err(new DomainError('CATEGORY_NOT_FOUND'));
    }
    return ok({ id: findRes.value.id });
  }
  findCategory(id: string) {
    return this.qb.execute(new FindCategoryQuery(id));
  }
  async listCategories(parent?: string) {
    const listRes = await this.qb.execute(new ListCategories(parent));
    return listRes;
  }
}
