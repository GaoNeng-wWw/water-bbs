import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { AppError, isErr, ok, Result } from 'water-bbs-shared';
import { CategoryRepo } from '../category.repo';
import { CategorySummary } from '../entities/category-summary.entry';

export class FindCategoryQuery extends Query<
  Result<CategorySummary | null, AppError>
> {
  constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(FindCategoryQuery)
export class FindCategoryQueryHandler implements IQueryHandler<FindCategoryQuery> {
  constructor(private readonly categoryRepo: CategoryRepo) {}
  async execute(
    query: FindCategoryQuery,
  ): Promise<Result<CategorySummary | null, AppError>> {
    const categoryRes = await this.categoryRepo.find(query.id);
    if (isErr(categoryRes)) {
      return categoryRes;
    }
    if (!categoryRes.value) {
      return categoryRes;
    }
    const category = categoryRes.value;
    return ok({
      id: category.id,
      name: category.name,
      parent: category.parentID,
      hasChildren: category.hasChildren,
    });
  }
}
