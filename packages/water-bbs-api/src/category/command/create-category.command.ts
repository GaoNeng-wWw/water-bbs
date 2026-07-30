import {
  Command,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { Category, CategoryInfo } from '../entities';
import { EntityManager } from '@mikro-orm/core';
import { CreateCategoryRequest } from '../dto/create-category.dto';
import { CategoryCreated } from '../events';

export class CreateCategory extends Command<CategoryInfo> {
  constructor(public request: CreateCategoryRequest) {
    super();
  }
}

@CommandHandler(CreateCategory)
export class CreateCategoryService implements ICommandHandler<CreateCategory> {
  constructor(
    private readonly em: EntityManager,
    private readonly eventBus: EventBus,
  ) {}
  async execute({ request }: CreateCategory): Promise<CategoryInfo> {
    const category = this.em.create(Category, {
      name: request.name,
      color: request.color,
      icon: request.icon,
      pined: request.pin,
    });
    this.em.persist(category);
    await this.em.flush();
    this.eventBus.publish(new CategoryCreated(category.id));
    return new CategoryInfo({
      name: category.name,
      color: category.color,
      icon: category.icon,
      pined: category.pined,
      createdAt: category.createdAt.toString(),
      id: category.id,
    });
  }
}
