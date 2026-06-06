import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppError, isErr, ok, Result } from 'water-bbs-shared';
import { CategoryRepo } from '../category.repo';

export class RemoveCategoryCommand extends Command<
  Result<{ id: string }, AppError>
> {
  constructor(public readonly id: string) {
    super();
  }
}

@CommandHandler(RemoveCategoryCommand)
export class RemoveCategoryCommandHandler implements ICommandHandler<RemoveCategoryCommand> {
  constructor(private readonly categoryRepo: CategoryRepo) {}
  async execute(
    command: RemoveCategoryCommand,
  ): Promise<Result<{ id: string }, AppError>> {
    const categoryRes = await this.categoryRepo.find(command.id);
    if (isErr(categoryRes)) {
      return categoryRes;
    }
    if (!categoryRes.value) {
      return ok({ id: command.id });
    }
    const category = categoryRes.value;
    category.remove();
    const upsertRes = await this.categoryRepo.upsert(category);
    if (isErr(upsertRes)) {
      return upsertRes;
    }
    return ok({ id: command.id });
  }
}
