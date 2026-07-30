import {
  Command,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { Category, CategoryId, CategoryInfo } from '../entities';
import { UpdateCategoryRequest } from '../dto/update-category.dto';
import { EntityRepository } from '@mikro-orm/sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';
import { err, ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { CategoryNotFound } from '../errors';

export class UpdateCategory extends Command<Result<CategoryInfo, DomainError>> {
  constructor(
    public readonly id: CategoryId,
    public readonly dto: UpdateCategoryRequest,
  ) {
    super();
  }
}

@CommandHandler(UpdateCategory)
export class UpdateCategoryService implements ICommandHandler<UpdateCategory> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: EntityRepository<Category>,
    private readonly eventBus: EventBus,
  ) {}
  async execute({
    id,
    dto,
  }: UpdateCategory): Promise<Result<CategoryInfo, DomainError>> {
    const category = await this.categoryRepo.findOne({
      id,
    });
    if (!category) {
      return err(new CategoryNotFound());
    }
    Object.assign(category, dto);
    await this.categoryRepo.upsert(category);
    return ok(
      new CategoryInfo({
        ...category,
        createdAt: category.createdAt.toString(),
      }),
    );
  }
}
