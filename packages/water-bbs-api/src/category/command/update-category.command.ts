import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppError, isErr, ok, Result } from 'water-bbs-shared';
import { CategoryRepo } from '../category.repo';

export class updateCategoryCommand extends Command<
  Result<{ id: string } | null, AppError>
> {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly parent?: string | null,
  ) {
    super();
  }
}

@CommandHandler(updateCategoryCommand)
export class updateCategoryCommandHandler implements ICommandHandler<updateCategoryCommand> {
  constructor(private readonly categoryRepo: CategoryRepo) {}
  async execute(
    command: updateCategoryCommand,
  ): Promise<Result<{ id: string } | null, AppError>> {
    const { id, name, parent } = command;
    const categoryRes = await this.categoryRepo.find(id);
    if (isErr(categoryRes)) {
      return categoryRes;
    }
    if (!categoryRes.value) {
      return ok(null);
    }
    const category = categoryRes.value;
    if (name) {
      category.name = name;
    }
    if (parent !== undefined) {
      category.parentID = parent;
    }
    const upsertRes = await this.categoryRepo.upsert(category);
    if (isErr(upsertRes)) {
      return upsertRes;
    }
    return ok({
      id: upsertRes.value.id,
    });
  }
}
