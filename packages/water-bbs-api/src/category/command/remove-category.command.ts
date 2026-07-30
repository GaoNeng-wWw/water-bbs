import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Category, CategoryId } from '../entities';
import { err, ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { EntityRepository } from '@mikro-orm/core';
import { CategoryNotFound } from '../errors';
import { InjectRepository } from '@mikro-orm/nestjs';

export class RemoveCategory extends Command<Result<CategoryId, DomainError>> {
  constructor(public readonly id: CategoryId) {
    super();
  }
}

@CommandHandler(RemoveCategory)
export class RemoveCategoryService implements ICommandHandler<RemoveCategory> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>
  ) {}
  async execute({
    id,
  }: RemoveCategory): Promise<Result<CategoryId, DomainError>> {
    const category = await this.categoryRepo.findOne({ id });
    if (!category) {
      return err(new CategoryNotFound(id));
    }
    category.remove();
    await this.categoryRepo.upsert(category);
    return ok(id);
  }
}
