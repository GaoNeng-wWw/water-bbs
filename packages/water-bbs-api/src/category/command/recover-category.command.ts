import {
  Command,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { Category, CategoryId } from '../entities';
import { DomainError } from '@app/shared';
import { EntityRepository } from '@mikro-orm/sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CategoryNotFound } from '../errors';
import { CategoryRecovered } from '../events';

export class RecoverCategory extends Command<Result<CategoryId, DomainError>> {
  constructor(public readonly id: CategoryId) {
    super();
  }
}

@CommandHandler(RecoverCategory)
export class RecoverCategoryService implements ICommandHandler<RecoverCategory> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,
    private readonly eventBus: EventBus,
  ) {}
  async execute({
    id,
  }: RecoverCategory): Promise<Result<CategoryId, DomainError>> {
    const category = await this.categoryRepo.findOne(
      { id },
      { filters: false },
    );
    if (!category) {
      return err(new CategoryNotFound(id));
    }
    if (category.removedAt) {
      category.recover();
    }
    await this.categoryRepo.upsert(category);
    this.eventBus.publish(new CategoryRecovered(category.id));
    return ok(category.id);
  }
}
