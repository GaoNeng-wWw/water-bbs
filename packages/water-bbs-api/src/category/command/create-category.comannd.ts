import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AppError, isErr, ok, Result } from 'water-bbs-shared';
import { CategoryRepo } from '../category.repo';
import { Category } from 'water-bbs-migration';

export class CreateCategoryCommand extends Command<
  Result<{ id: string }, AppError>
> {
  constructor(
    public name: string,
    public parent?: string,
  ) {
    super();
  }
}

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryCommandHandler implements ICommandHandler<CreateCategoryCommand> {
  constructor(private readonly categoryRepo: CategoryRepo) {}
  async execute(
    command: CreateCategoryCommand,
  ): Promise<Result<{ id: string }, AppError>> {
    const category = new Category(command.name, command.parent);
    const upsertCategoryResult = await this.categoryRepo.upsert(category);
    if (isErr(upsertCategoryResult)) {
      return upsertCategoryResult;
    }
    return ok({
      id: upsertCategoryResult.value.id,
    });
  }
}
