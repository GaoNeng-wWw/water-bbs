import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { Category, CategoryId, CategoryInfo } from '../entities';
import { DomainError } from '@app/shared';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { CategoryNotFound } from '../errors';

export class FindCategoryQuery extends Query<
  Result<CategoryInfo, DomainError>
> {
  constructor(public readonly id: CategoryId) {
    super();
  }
}

@QueryHandler(FindCategoryQuery)
export class FindCategoryService implements IQueryHandler<FindCategoryQuery> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
  ) {}
  async execute(
    query: FindCategoryQuery,
  ): Promise<Result<CategoryInfo, DomainError>> {
    const category = await this.categoryRepository.findOne({
      id: query.id,
    });
    if (!category) {
      return err(new CategoryNotFound());
    }
    return ok({
      ...category,
      createdAt: category.createdAt.toString(),
    });
  }
}
