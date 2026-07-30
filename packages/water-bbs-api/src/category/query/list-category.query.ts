import { PaginationQuery } from '@app/shared';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { Category, CategoryInfo } from '../entities';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

export class ListCategoryQuery extends Query<CategoryInfo[]> {
  constructor(public readonly query: PaginationQuery) {
    super();
  }
}

@QueryHandler(ListCategoryQuery)
export class ListCategoryService implements IQueryHandler<ListCategoryQuery> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,
  ) {}
  async execute({ query }: ListCategoryQuery) {
    const categories = await this.categoryRepo.findAll({
      offset: (query.page - 1) * query.size,
      limit: query.size,
    });
    return categories.map((category) => {
      return new CategoryInfo({
        ...category,
        createdAt: category.createdAt.toString(),
      });
    });
  }
}
