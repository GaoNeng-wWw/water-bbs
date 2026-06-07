import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { AppError, isErr, ok, Result } from 'water-bbs-shared';
import { CategoryRepo } from '../category.repo';
import { CategorySummary } from '../entities/category-summary.entry';

export class ListCategories extends Query<Result<CategorySummary[], AppError>> {
  constructor(public readonly parent?: string) {
    super();
  }
}

@QueryHandler(ListCategories)
export class ListCategoriesQueryHandler implements IQueryHandler<ListCategories> {
  constructor(private readonly categoryRepo: CategoryRepo) {}
  async execute(
    query: ListCategories,
  ): Promise<Result<CategorySummary[], AppError>> {
    const listRes = await this.categoryRepo.list(query.parent);
    if (isErr(listRes)) {
      return listRes;
    }
    const rawItems = listRes.value;
    const summaries = rawItems.map((item) => ({
      id: item.id,
      name: item.name,
      hasChildren: item.hasChildren,
      parentId: item.parentID,
    }));
    return ok(summaries);
  }
}
